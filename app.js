const  express = require('express');
const mysql = require('mysql');
const hbs =  require('hbs');
const bodyParser = require('body-parser');

const  app = express();
const port = 8500;

app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


var koneksi =  mysql.createConnection({
   host: 'localhost',
   user: 'rizal',
   password: '0000',
   database: 'db_pembayaransppku'
});

koneksi.connect((err) => {
   if(err) throw err;
   console.log("Koneksi Database Berhasil disambung ya boss");
});
app.get('/', (req, res) => {
    koneksi.query('use db_pembayaransppku', (err, hasil) => {
     if(err) throw err;
     res.render('home.hbs', {
         halaman: 'HOME',
         data: hasil
       });
    });
 });

 app.get('/home', (req, res) => {
    res.render( __dirname + '/views/home.hbs');
});

 //pembayaran
 app.get('/pembayaran', (req, res) => {
    koneksi.query('SELECT * FROM pembayaran', (err, hasil) => {
     if(err) throw err;
     res.render('pembayaran.hbs', {
         halaman: 'HOME',
         data: hasil
       });
    });
 });
 
 app.post("/pembayaran", (req, res) => {
   var siswa = req.body.inputsiswa;
   var bulan = req.body.inputbulan;
   var jumlah = req.body.inputjumlah; 
   var tanggal = req.body.inputtanggaltransaksi;  
   koneksi.query('INSERT INTO pembayaran( siswa, bulan, jumlah, tanggal_transaksi) VALUES( ?, ?, ?, ?)',
         [  siswa, bulan, jumlah, tanggal ],
             (err, hasil) => {
                 if(err) throw err;
                 res.redirect('/pembayaran');
                 }
           )
 });
 
 app.get('/resek/:id_pembayaran', (req,res) => {
     var pembayaran = req.params.idpembayaran;
     koneksi.query("DELETE FROM pembayaran WHERE id_pembayaran = ?",
     [pembayaran], (err, hasil) => {
         if(err) throw err;
         res.redirect('/pembayaran');
       }
     )
 });

app.listen(port, () => {
    console.log(`App berjalan pada port ${port}`);
});