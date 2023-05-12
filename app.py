from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
import requests
from bs4 import BeautifulSoup

client = MongoClient('mongodb+srv://sparta:test@cluster0.qihykt0.mongodb.net/?retryWrites=true&w=majority')
db = client.dbsparta
app = Flask(__name__)

#index.html로 연결
@app.route('/')
def home():
    return render_template('index.html')

#CREATE
@app.route("/movieworld_posting", methods=["POST"])
def movie_post():
    #url과 comment를 클라이언트에서 받아온다.
    url_receive = request.form['url_give']
    comment_receive = request.form['comment_give']
    trailer_receive = request.form['trailer_give']

    #크롤링을 위해 사용하는 코드.
    headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(url_receive,trailer_receive,headers=headers)
    soup = BeautifulSoup(data.text, 'html.parser')
    

    #크롤링
    ogtitle = soup.select_one('meta[property="og:title"]')['content']
    ogimage = soup.select_one('meta[property="og:image"]')['content']
    genre = soup.select_one('#mainContent > div > div.box_basic > div.info_detail > div.detail_cont > div:nth-child(1) > dl:nth-child(2) > dd').text.split('/')[0]
    score = soup.select_one('#mainContent > div > div.box_basic > div.info_detail > div.detail_cont > div:nth-child(2) > dl:nth-child(1) > dd').text

    #m_id는 db전체 데이터의 길이를 가져와 저장한다
    m_id = len(list(db.movies.find({})))
    

    #db에 저장하는 코드. like는 좋아요, 초기값은 0으로 준다.
    doc = {
        'title':ogtitle,
        'image':ogimage,
        'comment':comment_receive,
        'genre':genre,
        'score':score,
        'm_id': m_id,
        'trailer':trailer_receive,
        'like':0
    }
    db.movies.insert_one(doc)

    return jsonify({'msg':'작성 완료!'})

#DELETE
@app.route("/movieworld_delete", methods=["POST"])
def movie_delete():
    #db에 m_id가 int로 저장되어 있으니 str로 넘어오는 m_id를 int로 변경해준다.
    m_id_receive = int(request.form['m_id_give'])
    #m_id가 받아온 m_id인걸 찾아서 삭제한다.
    db.movies.delete_one({'m_id':m_id_receive})
    return jsonify({'msg':"삭제 완료!"})

#READ
@app.route("/movieworld", methods=["GET"])
def movie_get():   
    all_movies = list(db.movies.find({},{'_id':False}))
    return jsonify({'result': all_movies})


#UPDATE. LIKE
@app.route("/movieworld_like", methods=["POST"])
def movie_like():
    like_receive = int(request.form['like_give'])
    m_id_receive = int(request.form['m_id_give'])
    db.movies.update_one({'m_id':m_id_receive},{'$set':{'like':like_receive}})
    return jsonify({'msg': '추천!'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
