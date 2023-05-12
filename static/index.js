// $(document).ready(function(){ })와 같음.
$(function() { 
    listing();
});

// READ
function listing() {
    fetch('/movieworld').then((res) => res.json()).then((data) => {
        let rows = data['result']
        $('.box2Container').empty();
        rows.forEach((a) => {
            console.log(a)
            let comment = a['comment'];
            let title = a['title'];
            let image = a['image'];
            let score = a['score'];
            let genre = a['genre'];
            let m_id = a['m_id'];
            let like = a['like'];
            let trailer = a['trailer'].substring(a['trailer'].indexOf("=") + 1); //trailer URL에서 유튜브ID만 따옴

            let temp_html = `<div id="${genre}" class="box2 on">
                                <!-- 좋아요 버튼 -->
                                <i class="heart" data-m_id="${m_id}" data-like="${like}">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="40" viewBox="0 0 24 24" width="40">
                                        <path d="M0 0h24v24H0z" fill="none" />
                                        <path
                                            d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" 
                                        />
                                    </svg>
                                </i>
                                
                                <div class="imageBox" style="background-image: url(${image});"></div>
                                <!-- 삭제 버튼 -->
                                <i class="fa-solid fa-xmark" id="delete" name="${m_id}" onclick="movieworld_delete(${m_id})"></i>
                                <ul class="list">
                                <div><li class="ListBox">제목 : ${title}</li></div>
                                    <div><li class="ListBox">장르 : ${genre}</li> <li class="ListBox">평점 : ${score}</li> <li class="ListBox">좋아요 : ${like}</li></div>
                                    <div><li class="ListBox">코멘트 : ${comment}</li></div>
                                    <!-- 모달열기 아이콘 링크. 모달창 ID를 data-bs-target="#exampleModal-${trailer}"로 잡아줘야 모달창마다 다른 트레일러 주소가 할당됨.-->  
                                    <div>
                                        <a class="modal-a" data-bs-toggle="modal" data-bs-target="#exampleModal-${trailer}">
                                            <i class="fa-brands fa-youtube Youtube-Icon"></i>
                                        </a>
                                        <!-- 모달창 -->
                                        <div class="modal fade" id="exampleModal-${trailer}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                            <div class="modal-dialog modal-dialog-centered modal-lg">
                                                <div class="modal-content modal-container">
                                                    <div class="modal-body modal-body-bg">
                                                        <!--유튜브 비디오 iframe -->
                                                        <iframe 
                                                            width=100% height=100% 
                                                            src="https://www.youtube.com/embed/${trailer}" 
                                                            title="YouTube video player" frameborder="0" 
                                                            allow="accelerometer; autoplay; clipboard-write; 
                                                            encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                                                        </iframe>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </ul>
                            </div>`;
            $('.box2Container').prepend(temp_html); // prepend 는 내림차순.

            // 좋아요 토글 코드
            let togglingBtns=document.querySelector('.heart');
            togglingBtns.addEventListener('click',function(){

                // 좋아요 업데이트.
                like_update(this.dataset.m_id, this.dataset.like);
                
                togglingBtns.classList.toggle('active');
            })

            //모달 끄면(hide.bs.modal) 영상 중지.
            $(`#exampleModal-${trailer}`).on('hide.bs.modal', function (e) {
                // 모달 창 내부에 있는 iframe요소를 찾음.
                let iframe = $(this).find('iframe');
                // attr()메서드를 사용하여 iframe 요소의 src 속성값을 가져온 후,
                let videoSrc = iframe.attr('src');
                // iframe 요소의 src 속성값을 빈 문자열로 설정하여 영상 중지
                iframe.attr('src', '');
                // src 속성값을 이전값(videoSrc)으로 설정하여 원래 영상을 다시 시작할 수 있도록 함.
                iframe.attr('src', videoSrc);
            });
        });
    })
}

// CREATE
function posting() {
    let url = $('#url').val()
    let comment = $('#comment').val()
    let trailer =$('#trailer').val()

    let formData = new FormData();
    formData.append("url_give", url);
    formData.append("comment_give", comment);
    formData.append("trailer_give", trailer);

    fetch('/movieworld_posting', { method: "POST", body: formData }).then((res) => res.json()).then((data) => {
        alert(data['msg'])
        // 새로고침
        window.location.reload()
    })
}

// DELETE. jquery로 이벤트가 작동하지 않아서 onclick을 사용했다. 
// html내부의 onclick에서 m_id를 인자로 넘기기에 받기위해 m_id를 지정.
function movieworld_delete(m_id) {
    let formData = new FormData();
    formData.append("m_id_give", m_id);
    fetch('/movieworld_delete', { method: "POST", body: formData }).then((res) => res.json()).then((data) => {
        alert(data['msg'])
        //새로고침
        window.location.reload()
    })
}

// UPDATE.
// 좋아요와 글 번호를 받아서 사용한다.
function like_update(m_id,like) {
    let formData = new FormData();
    console.log(m_id)
    console.log(like)
    like++;
    formData.append("like_give", like);
    formData.append("m_id_give", m_id);
    fetch('/movieworld_like', { method: "POST", body: formData }).then((res) => res.json()).then((data) => {
        alert(data['msg'])
    })
}
