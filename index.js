const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const playList = $('.playlist');
const cd = $('.cd');
const playBtn =$('.btn-toggle-play');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const player = $('.player');
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.prevSong')
const repeatBtn = $('.btn-repeat')
const playLists = $('.playlist')
 

const app = {
  currentIndex: 0,
  isRandom:false,
  isplaying:false,
  isrepeat:false,
  config: JSON.parse(localStorage.getItem('PLAYER_STORAGE_KEY')) || {},
  songs:[
    {
    name: "Reality",
    singer: "Raftaar x Brobha V",
    path:"./music/music-3.mp3",
    image: "./img/image-3.jpg"
    },
    {
      name: " Summertime K 391",
      singer: "Raftaar x Salim Merchant x Karma",
      path: "./music/music-2.mp3",
      image:"./img/image-2.jpg"
    },
    {
      name: "Nevada",
      singer: "Raftaar x Fortnite",
      path: "./music/music-2.mp3",
      image: "./img/image-1.jpg"
    },
    {
      name: "Yeu Nguoi Khong Duoc Lai Duoc Nguoi Khac Yeu Nguyen Phi Bang",
      singer: "Raftaar x Nawazuddin Siddiqui",
      path: "./music/music-4.mp3",
      image:"./img/image-4.jpg"
    },
    {
      name: "Lemon Tree Mina",
      singer: "Raftaar",
      path: "./music/music-5.mp3",
      image:
        "./img/image-5.jpg"
    },
    {
      name: "Sugar Free T ARA",
      singer: "Raftaar x kr$na",
      path:"./music/music-6.mp3",
      image:"./img/image-6.jpg"
    },
    {
      name: "My Love Westlife",
      singer: "Raftaar x Harjas",
      path: "./music/music-7.mp3",
      image:"./img/image-7.jpg"
    },
    {
        name: "Attention Beat Niki Nhi Ha",
        singer: "Raftaar x kr$na",
        path:"./music/music-8.mp3",
        image:"./img/image-8.png"
      },
  ],
  setConfig: function(key,value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
  },
  render: function() {
   const htmls = this.songs.map( (song,index) => {
      return`
                 <div class="song ${index === this.currentIndex  ? 'active' : ''}" data-index= "${index}">
                      <div class="thumb"
                          style="background-image: url('${song.image}')">
                      </div>
                      <div class="body">
                          <h3 class="title">${song.name}</h3>
                          <p class="author">${song.singer}</p>
                      </div>
                      <div class="option">
                          <i class="fas fa-ellipsis-h"></i>
                      </div>
                  </div>
      `
    });
    playList.innerHTML = htmls.join('')
  },
  defineProperties: function() {
      Object.defineProperty(this,'currentSong',{
        get: function() {
            return this.songs[this.currentIndex];
        }
      })
  },
  handleEvent: function() {
    const _this = this
    //Xử lý quay cd
    const cdThumbAnimate = cdThumb.animate([
      {transform:'rotate(360deg)'}
    ],{
      duration:10000,
      iteration:Infinity
    })
    cdThumbAnimate.pause();
    // Xử lý phóng to thu nhỏ cd
    const cdWidth = cd.offsetWidth;
    document.onscroll = function() {
    const scrollTop =  window.scrollY|| document.documentElement.scrollTop;
    const newWidth = cdWidth - scrollTop;
    cd.style.width = newWidth  < 0 ? 0 : newWidth  +  'px';
    },
    playBtn.onclick = function() {
      if(_this.isplaying) {
        audio.pause();
      }else{
       
        audio.play();
      }
    }
    //khi click play song
    audio.onplay = function() {
      _this.isplaying = true;
      player.classList.add('playing')
      cdThumbAnimate.play()
    },
    //Xử lý khi click pause
    audio.onpause = function() {
      _this.isplaying = false;
      player.classList.remove('playing')
      cdThumbAnimate.pause()
    },
    //Khi tiến độ bài hat thay đổi
    audio.ontimeupdate = function() {
      if(audio.duration) {
        const progressPerCent = Math.floor(audio.currentTime / audio.duration *100);
        progress.value = progressPerCent;
      }
    }
    //Xử lý khi tua song
    progress.onchange = function(e) {
      const seekTime = audio.duration/ 100 * e.target.value;
      audio.currentTime = seekTime;
    },
    //Khi next Song
    nextBtn.onclick = function() {
      if(_this.isRandom) {
        _this.playRandomSong();
      }else{
        _this.nextSong()
      }
      audio.play()
      _this.render()
      _this.scrollActiveSong()

    },
    //Khi prev Song
    prevBtn.onclick = function() {
      if(_this.isRandom) {
        _this.playRandomSong();
      }else{
        _this.prevSong()
      }  
      audio.play()
      _this.render()
      _this.scrollActiveSong()

    }
    //Xử lý bật tắt random song
    randomBtn.onclick = function() {
      _this.isRandom = !_this.isRandom;// phủ định chính nó là tự đảo ngược
      _this.setConfig('isRandom',_this.isRandom)
       randomBtn.classList.toggle('active',_this.isRandom);
      //  nếu true sẽ add nếu false thì sẽ remove;
    },
    // Xử lý khi audio ended
    audio.onended = function() {
      if(_this.isrepeat) {
        audio.play()
      }else{
        nextBtn.click()
      }
    },
    // Xử lý khi repeat audio
    repeatBtn.onclick = function() {
      _this.isrepeat = !_this.isrepeat
      _this.setConfig('isrepeat',_this.isrepeat)
        repeatBtn.classList.toggle('active',_this.isrepeat)
    },
    //lẵng nghe hành vi click vào playlist
    playLists.onclick = function(e) {
      const songNode = e.target.closest('.song:not(.active)') 

      if(songNode|| e.target.closest('.option')) {

          if(songNode) {
          // Để lấy dc get lấy cái index
              // console.log(songNode.getAttribute('data-index'))
             _this.currentIndex = Number(songNode.dataset.index),
             // current là dang số  nên phải chuyển lại sang number
             _this.LoadCurrentSong(),
             audio.play(),
             _this.render()
          }
          if(e.target.closest('.option')) {

          }
      }
    } 
  },
  scrollActiveSong: function() {
    setTimeout(() => {
      $('.song.active').scrollIntoView(
        {
          behavior :'smooth',
          block:'nearest'

      }

      )
    },300)
    //Lắng nghe click vào playlist

  },
  //Xử lý tải dữ liệu bài hát
  LoadCurrentSong: function() {
      heading.innerHTML = this.currentSong.name;
      cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
      audio.src = this.currentSong.path;
  },
  loadConfig: function() {
    this.isRandom = this.config.isRandom
    this.isrepeat = this.config.isrepeat
  },
  nextSong: function() {
      this.currentIndex++
      if(this.currentIndex >= this.songs.length) {
        this.currentIndex = 0
      }
      this.LoadCurrentSong();
  },
  prevSong: function() {
    this.currentIndex--
    if(this.currentIndex < 0) {
      this.currentIndex = this.songs.length -1;
    }
    this.LoadCurrentSong();
  },
  playRandomSong: function() {
    let newIndex
    //dùng do vì nếu random vào bài hiện tại sẽ random tiếp đến khi không trùng thì thôi
    do{
      newIndex = Math.floor(Math.random() * this.songs.length)
    }while(newIndex ===  this.currentIndex)

    this.currentIndex = newIndex;
    this.LoadCurrentSong();
  },
  start: function() {
    // Gán cấu hình từ config vào ứng dụng
    this.loadConfig();
    //Định nghĩa thuộc tính cho Object
    this.defineProperties();
    //Xử lý sự kiện
    this.handleEvent();
    //load thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.LoadCurrentSong();
    //Xử lý render ra view
    this.render();
    //Hiển thị trạng thái ban đầu
    randomBtn.classList.toggle('active',_this.isRandom)
    repeatBtn.classList.toggle('active',_this.isrepeat)
  }
}
app.start();