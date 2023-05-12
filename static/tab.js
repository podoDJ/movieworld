// 탭 구현
// .genre인 요소를 클릭하면 
$('.genre').click(function () {
    console.log('클릭')
    // tab_name은 클릭한 요소의 datatype속성
    let tab_name = $(this).attr('data-type');
    // .genre의 클래스에서 on 삭제
    $('.genre').removeClass('on');
    // .box2 클래스에서 on 삭제
    $('.box2').removeClass('on');
    // 클릭한 요소에 on 추가
    $(this).addClass('on');
    $('#' + tab_name).addClass('on');
    // name값이 tab_name과 동일한 요소에 on 추가. name을 사용한 이유는 요소가 여러개일때 모든 요소에 추가해 주기 위해 > 그냥 오류였나보다. 컴퓨터 껏다 키니까 id로도 동작.
    // $(`[name=${tab_name}]`).addClass('on');
});

// 전체 클릭하면 모든 .box2에 on 추가
$('.genre_all').click(function () {
    $('.box2').addClass('on');
})