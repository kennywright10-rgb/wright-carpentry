(function(){
  var PID='ChIJB_bzeuMx3YARWMCeOwbfp9k';
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function renderReviews(reviews){
    var grid=document.querySelector('.testimonials-grid');
    if(!grid||!reviews.length) return;
    var top=reviews.filter(function(r){return r.rating>=4;}).slice(0,3);
    if(!top.length) top=reviews.slice(0,3);
    grid.innerHTML=top.map(function(r){
      var stars='★'.repeat(r.rating)+'☆'.repeat(5-r.rating);
      var ini=r.author_name.split(' ').map(function(n){return n[0]||'';}).join('').slice(0,2).toUpperCase();
      return '<article class="testimonial-card" style="opacity:1;transform:none;">'
        +'<div class="stars">'+stars+'</div>'
        +'<p class="testimonial-text">“'+esc(r.text)+'”</p>'
        +'<div class="reviewer"><div class="reviewer-avatar">'+esc(ini)+'</div>'
        +'<div><div class="reviewer-name">'+esc(r.author_name)+'</div>'
        +'<div class="reviewer-loc">Verified Google Review</div>'
        +'</div></div></article>';
    }).join('');
  }
  function initReviews(){
    var el=document.createElement('div');
    el.style.cssText='position:fixed;top:-9999px;left:-9999px;width:200px;height:200px;';
    document.body.appendChild(el);
    var svc=new google.maps.places.PlacesService(el);
    svc.getDetails({placeId:PID,fields:['reviews']},function(place,ds){
      if(ds===google.maps.places.PlacesServiceStatus.OK&&place&&place.reviews){
        renderReviews(place.reviews);
      }
    });
  }
  window.initReviews=initReviews;
})();