
var express=require('express');
var app=express();
var cors=require('cors');
var bodyParser=require('body-parser');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

app.post('/api/scraping',function(req,res){
    var client = require('cheerio-httpcli');
    var keyword = req.body.message;
    var page = ['0', '1', '2', '3', '4', '5'] //�Ѿ ������ ����
    var url;
    var param = {};
    var res_dict={};
    var temp_dict={};
    var rank=0;
 
    for(var j=0; j<page.length; j++){
        url = 'https://lib.dongguk.edu/search/tot/result?st=KWRD&si=TOTAL&pn='+page[j]+'&q='+keyword;
        url = encodeURI(url);


        client.fetch(url, param, function(err, $){
        if(err){
          console.log(err);
          return;
        }
  
        var img_src_List = $("div.result").find(".book").find("a").find("img"); //�̹��� ���� src
        var aList = $("div.result").find(".title").find("a"); //text: å�̸�  href: �̹��� Ŭ���� �Ѿ�� ������
        var h;
        for(let i=0; i < aList.length; i++){
            rank++;
            img=$(img_src_List[i]).attr("src");//�̹��� ���� src
            title=$(aList[i]).text();//å�̸�
            link = 'https://lib.dongguk.edu/'+$(aList[i]).attr("href"); //�̹��� Ŭ���� �Ѿ�� ������
            temp_dict[rank]={'img':img, 'title':title, 'link':link};
            
            res_dict[String(rank)]=temp_dict[rank];

            //console.log(res_dict[String(rank)]);
        }
        console.log(res_dict);

        })
        //console.log(res_dict);

     rank=0;
    }
    res.json(res_dict);
});

app.listen(3000, function(){
    console.log('Server is running...');
});
