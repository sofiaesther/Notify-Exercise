import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';
import cors from 'cors';
import dayjs from 'dayjs';

const server = express();
server.use(cors());
server.use(express.json());

dotenv.config();

const { Pool } = pg;

const connection = new Pool({
    connectionString: process.env.DATABASE_URL,
  });


server.get('/', async (req, res) =>{
    try{
        const table = await connection.query(`
        SELECT
	d1.*,
	d2.elegible,
	d2."BCE_SCR_OPEN_EMAIL_LAST_DATE" AS"LAST_DATE_2022"
	
    FROM
	"DPR_DB20210602" "d1"
    JOIN
	"DPR_DB20220604" "d2" ON "d1"."EMAIL_HACHE" = "d2"."EMAIL_HACHE"
;`);

    let lst3 =0;
    let lst6 =0;
    let lst12 =0;
    let lst24 =0;
    let lstmore =0;
    let lst3e =0;
    let lst6e =0;
    let lst12e =0;
    let lst24e =0;
    let lstmoree =0;


    table.rows.map((e)=>{
        const date1 = dayjs(e.BCE_SCR_OPEN_EMAIL_LAST_DATE);
        const date2 = dayjs(e.LAST_DATE_2022);
        const difference = date1.diff(date2,'month');
        if(difference<3){
            if(e.elegible ===0){
                lst3e+= 1;
            };
                lst3 += 1;
            
        }else if(difference<6){
            if(e.elegible ===0){
                lst6e+= 1;
            }
                lst6+= 1;
    }else if(difference<12){
            if(e.elegible ===0){
                lst12e+= 1;
            };
                lst12+= 1;
        }else if(difference<24){
            if(e.elegible ===0){
                lst24e+= 1;
            };
                lst24+= 1;
        }else if(difference>24){
            if(e.elegible ===0){
                lstmoree+= 1;
            };
                lstmore+= 1;
        };
    });
    const tabledata = [
        ['opentime','volume','elegible'],
        ['0-3 months',lst3,lst3e],
        ['3-6 months',lst6,lst6e],
        ['6-12 months',lst12,lst12e],
        ['12-24 months',lst24,lst24e],
        ['24+ months',lstmore,lstmoree],
    ];

    console.log(
        tabledata
        );


    res.send(200);

    }catch(err){
        console.log(err);
        res.send(err);
    }
});




server.listen(process.env.PORT,()=>{
    console.log(`Server is listening on port ${process.env.PORT}`);
});




