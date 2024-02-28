const PermaphicGUI = new (class {
  constructor() {
    this.questions = [];
    this.questionSize = 5;
    this.questionIndex = 0;

    this.afktimer = 0;

    this.e = {};

    this.e.root = document.querySelector('#permaphic');
    this.e.header = document.querySelector('header');
    this.e.footer = document.querySelector('footer');
    this.e.footer_status = this.e.footer.querySelector('.status p');
    this.e.footer_hover = this.e.footer.querySelector('.hover p');

    this.e.screens = document.querySelector('main > .screens');
    this.e.screen_welcome = this.e.screens.querySelector(
      '.screen[name="welcome"]'
    );
    this.e.screen_question = this.e.screens.querySelector(
      '.screen[name="question"]'
    );
    this.e.screen_print = this.e.screens.querySelector('.screen[name="print"]');

    this.e.screen_question_form = this.e.screen_question.querySelector('.form');

    this.e.button = {};
    this.e.button.start = document.querySelector('#button-start');
    this.e.button.prev = document.querySelector('#button-prev');
    this.e.button.next = document.querySelector('#button-next');
    this.e.button.reset = document.querySelector('#button-reset');
    this.e.button.reset2 = document.querySelector('#button-reset2');
    this.e.button.generate = document.querySelector('#button-generate');
    this.e.button.print = document.querySelector('#button-print');

    this.addEventListener();

    let loadingdots = '';
    setInterval(() => {
      loadingdots += '.';
      if (loadingdots.length >= 4) {
        loadingdots = '';
      }
      const ldv = loadingdots
        .padEnd(3, ' ')
        .replace(/ /g, '<span style="color: transparent;">.</span>');
      for (const lde of document.querySelectorAll('.loadingdots')) {
        lde.innerHTML = ldv;
      }
    }, 250);

    this.show('welcome');
  }

  addEventListener() {
    for (const name in this.e.button) {
      const button = this.e.button[name];
      button.setAttribute('name', name);
      button.addEventListener('click', (event) => {
        let target = event.target;
        while (target.nodeName != 'BUTTON') {
          target = target.parentElement;
        }
        if (target.disabled) {
          return;
        }
        switch (target.getAttribute('name')) {
          case 'start': {
            this.show('question-init');
            break;
          }
          case 'prev': {
            this.show('question', this.questionIndex - 1);
            break;
          }
          case 'next': {
            this.show('question', this.questionIndex + 1);
            break;
          }
          case 'reset':
          case 'reset2': {
            this.show('welcome');
            break;
          }
          case 'generate': {
            this.show('graphic-init');
            break;
          }
          case 'print': {
            this.show('print');
            break;
          }
        }
      });
    }

    for (const name in this.e.button) {
      const button = this.e.button[name];
      button.setAttribute('name', name);
      button.addEventListener('mouseover', (event) => {
        let target = event.target;
        while (target.nodeName != 'BUTTON') {
          target = target.parentElement;
        }
        if (target.disabled) {
          return;
        }
        event.stopPropagation();
        switch (target.getAttribute('name')) {
          case 'start': {
            this.hoverMessage('질문 응답을 시작합니다');
            break;
          }
          case 'prev': {
            this.hoverMessage('이전 질문으로 돌아갑니다');
            break;
          }
          case 'next': {
            this.hoverMessage('다음 질문으로 이동합니다');
            break;
          }
          case 'reset':
          case 'reset2': {
            this.hoverMessage(
              '질문 응답을 초기화하고 처음 화면으로 되돌아갑니다'
            );
            break;
          }
          case 'generate': {
            this.hoverMessage('질문 응답을 통해 그래픽을 생성합니다');
            break;
          }
          case 'print': {
            this.hoverMessage('생성된 그래픽을 출력합니다');
            break;
          }
          default: {
            this.hoverMessage('');
          }
        }
      });
    }
    this.e.root.addEventListener('mouseover', () => {
      this.hoverMessage('');
    });
  }

  async show(screen, ...args) {
    switch (screen) {
      case 'welcome': {
        this.setMain('welcome_loading');
        await delay(750);
        this.setMain('welcome');
        this.statusMessage('준비됨');
        this.e.button.prev.disabled = true;
        this.e.button.next.disabled = true;
        this.e.button.reset.disabled = true;
        this.e.button.generate.disabled = true;
        this.questionIndex = 0;
        this.questions = [];
        break;
      }

      case 'question-init': {
        this.setMain('question_loading');
        this.statusMessage(``);
        this.questions = new PermaphicQuestions(this.questionSize);
        await delay(1500);
        this.show('question', 1);
        break;
      }

      case 'question': {
        this.questionIndex = args[0];
        const question = this.questions.get(this.questionIndex);

        this.setMain('question');
        this.statusMessage(
          `질문 응답 중 (${this.questionIndex}/${this.questionSize})`
        );
        if (this.questionIndex <= 1) {
          this.e.button.prev.disabled = true;
        } else if (this.questionIndex >= this.questionSize) {
          this.e.button.prev.disabled = false;
        } else {
          this.e.button.prev.disabled = false;
        }
        if (question.a != -1 && this.questionIndex < this.questionSize) {
          this.e.button.next.disabled = false;
        } else {
          this.e.button.next.disabled = true;
        }
        let a = 0;
        for (const i in this.questions.data) {
          const q = this.questions.get(i);
          if (q.a != -1) {
            a++;
          }
        }
        if (a >= this.questionSize) {
          this.e.button.generate.disabled = false;
        } else {
          this.e.button.generate.disabled = true;
        }
        this.e.button.reset.disabled = false;

        let html = '';
        html += `<br />`;
        html += `<p>${this.questionIndex}. ${question.q}</p>`;
        for (let i = 0; i < question.o.length; i++) {
          html += `<br />`;
          html += `<div checkbox>`;
          html += `  <input type="radio" name="${
            this.questionIndex
          }" question="${this.questionIndex}" value="${i + 1}" ${
            i + 1 == question.a ? 'checked' : ''
          } />`;
          html += `  <div class="checkbox">`;
          html += `    <div class="dot"></div>`;
          html += `  </div>`;
          html += `  <label>${question.o[i]}</label>`;
          html += `</div>`;
        }

        if (this.questionIndex == this.questionSize) {
          html += `<br />`;
          html += `<br />`;
          html += `<fieldset class="wrapper" outline="1">`;
          html += `  <legend>마지막 질문 응답</legend>`;
          html += `  <p>응답이 모두 기록되었습니다. [<u onclick="document.querySelector('#button-generate').focus();">생성</u>] 단추를 눌러 그래픽을 생성하십시오.</p>`;
          html += `</fieldset>`;
        }

        this.e.screen_question_form.innerHTML = html;

        for (const btn of this.e.screen_question_form.querySelectorAll(
          'input[type="radio"]'
        )) {
          btn.addEventListener('change', (event) => {
            const index = event.target.getAttribute('question') * 1;
            const awnser = event.target.getAttribute('value') * 1;
            this.questions.set(index, awnser);
            if (index < this.questionSize) {
              this.e.button.next.disabled = false;
            } else {
              this.e.button.generate.disabled = false;
            }
            if (index > this.questionSize - 2) {
              render();
            }
          });
        }
        break;
      }

      case 'graphic-init': {
        this.setMain('graphic_loading');
        this.statusMessage(``);
        await delay(1500);
        this.show('graphic');
        break;
      }

      case 'graphic': {
        this.setMain('graphic');
        render();
        this.statusMessage(`인쇄 준비됨`);
        this.e.button.prev.disabled = true;
        this.e.button.next.disabled = true;
        this.e.button.reset.disabled = false;
        this.e.button.generate.disabled = false;
        break;
      }

      case 'print': {
        this.setMain('print_loading');
        this.statusMessage(``);
        await delay(1500);
        this.show('graphic');
        break;
      }
    }
  }

  setMain(s) {
    for (const screen of this.e.screens.querySelectorAll('.screen')) {
      if (screen.getAttribute('name') == s) {
        screen.style.display = null;
      } else {
        screen.style.display = 'none';
      }
    }
  }

  displayPreview() {}

  statusMessage(message) {
    this.e.footer_status.innerHTML = message;
  }

  hoverMessage(message) {
    this.e.footer_hover.innerHTML = message;
  }
})();

class PermaphicQuestions {
  constructor(size = 5) {
    this.size = size;
    this.data = {};
    this.used = [];
    this.pool = [
      {
        q: '마음에 드는 숫자를 선택해 주세요.',
        o: ['-3', '0', '2', '7', '60', '999', '-2147483648'],
      },
      {
        q: '마음에 드는 간식을 선택해 주세요.',
        o: [
          '바나나',
          '초코쿠키',
          '샌드위치',
          '카라멜',
          '팥 붕어빵',
          '복숭아 아이스티',
        ],
      },
      {
        q: '좀 더 좋아하는 맛을 선택해 주세요.',
        o: ['단맛', '짠맛', '신맛', '매운맛', '쓴맛'],
      },
      {
        q: '내일 아침 8시까지 잠에서 깰 수 있을까요?',
        o: ['깰 수 있어요', '계속 잠들어 있을 거에요'],
      },
      {
        q: '더 각지다고 생각되는 도형을 선택해 주세요.',
        o: ['삼각형', '사각형', '육각형', '동그라미'],
      },
      {
        q: '더 하고 싶은 것은 무었인가요?',
        o: ['잠자기', '밥먹기', '바닥에 주저앉기', '상상하기'],
      },
      {
        q: '다음 달에 여행을 간다면, 어느 정도 기간이 적당할까요?',
        o: ['당일치기', '1박2일', '3박4일', '2주간', '1개월간', '6개월간'],
      },
      {
        q: '지나가다 반짝이는 돌을 발견했습니다. 얼마에 팔릴까요?',
        o: [
          '300원',
          '2,700원',
          '36,900원',
          '47만원',
          '1억원',
          '쓰레기는 돈을 내고 버려야 해요',
        ],
      },
      {
        q: '아이스크림은 어떤 온도에서 가장 행복할까요?',
        o: ['-274도', '-30도', '2도', '22도', '373도'],
      },
      {
        q: '하루에 듣는 음악이 몇 곡 정도 되나요?',
        o: [
          '-2곡',
          '1곡 ~ 5곡',
          '6곡 ~ 20곡',
          '21곡 ~ 60곡',
          '셀 수 없을 만큼 많이',
          '그런 것 듣지 않아',
        ],
      },
      {
        q: '평소에 집 밖으로 나가 암벽등반을 즐기는 편인가요?',
        o: [
          '매우 그렇다',
          '약간 그렇다',
          '보통이다',
          '그렇지 않다',
          '전혀 그렇지 않다',
        ],
      },
      {
        q: '가장 초록색인 문자를 골라주세요.',
        o: ['ㅊ', 'A', 'G', '2', '♨'],
      },
      {
        q: '레몬 1개에는 비타민C 가 얼마나 들어 있을까요?',
        o: [
          '레몬 반개',
          '레몬 1개',
          '레몬 2개',
          '두 컵',
          '한 자루',
          '레몬에는 비타민C 가 들어 있지 않다',
        ],
      },
      {
        q: '방의 불이 꺼졌습니다. 왜 방의 불이 꺼졌을까요?',
        o: [
          '전구가 폭발해서',
          '누군가 스위치를 꺼서',
          '누전 차단기가 내려가서',
          '실명이 되어서',
          '우주가 멸망해서',
          '방의 불은 꺼지지 않았다',
        ],
      },
      {
        q: '무인도에 떨어졌을 때 가져가고 싶은 물건을 하나만 골라주세요.',
        o: ['무인도', '유령', '강아지풀', '연필', 'HDMI 케이블', '공인인증서'],
      },
      {
        q: '길을 걷던 돼지 저금통에 얼마가 들어 있을까요?',
        o: ['200원', '3,700원', '112,000원', '레몬 2개', '200원짜리 동전 하나'],
      },
      {
        q: '학교에서 가장 큰 나무 아래엔 무엇이 있을까요?',
        o: ['보물 상자', '편지', '버섯', '예쁜 유리병', '시체'],
      },
      {
        q: '이불 속에서 느끼는 감정은 어떤 감정인가요?',
        o: ['행복하다', '행복하다', '행복하다', '우울하다', '행복하다'],
      },
      {
        q: '길에서 싸우고 있는 사람을 보면 어떻게 행동하고 싶은가요?',
        o: [
          '싸움을 말린다',
          '같이 싸운다',
          '구경한다',
          '잡아먹는다',
          '경찰에 신고한다',
        ],
      },
      {
        q: '구구구국구구구구구구구구구구구구구구구구구구구구구구구구?',
        o: [
          '된장국',
          '자동차',
          '2개',
          '3 - 1번지 우체통 위 도토리',
          '광양시에는 제철소가 있습니다',
          '6개월간',
        ],
      },
      {
        q: '여행을 갈 때 어느 정도 계획을 하고 떠나나요?',
        o: [
          '상상할 수 있는 모든 것',
          '호텔과 교통편만',
          '계획이 무슨 뜻인지 몰라요',
        ],
      },
      {
        q: '토끼 귀여워',
        o: ['응', '아니'],
      },
      {
        q: 'Permaphic 개인정보처리방침에 동의하십니까?',
        o: ['예', '예', '예', '예', '예', '예', '예'],
      },
      {
        q: '하늘과 가장 가까운 소파에는 몇 명이 앉아 있었을까요?',
        o: ['1명', '2명', '3명', '24명', '소파를 잃어버렸어요'],
      },
      {
        q: '평소에 다른 사람의 시선을 신경 쓰는 편인가요?',
        o: [
          '매우 그렇다',
          '약간 그렇다',
          '보통이다',
          '그렇지 않다',
          '전혀 그렇지 않다',
        ],
      },
      {
        q: '혼자 있는 것이 함께 있는 것보다 낫다.',
        o: [
          '매우 그렇다',
          '약간 그렇다',
          '보통이다',
          '그렇지 않다',
          '전혀 그렇지 않다',
        ],
      },
      {
        q: '하늘에서 반짝이는 것을 발견했습니다. 무엇이었나요?',
        o: ['별', '달', '비행기', '풍선', 'UFO', '하늘 조각'],
      },
      {
        q: '잠에서 깨어났던 날, 그 버스에는 몇 명이 타고 있었나요?',
        o: ['아무도', '2명', '4명', '19명', '나비 2마리'],
      },
      {
        q: '프린터에 종이가 충분히 있나요?',
        o: [
          '매우 그렇다',
          '약간 그렇다',
          '보통이다',
          '그렇지 않다',
          '전혀 그렇지 않다',
        ],
      },
      {
        q: '김치찌개에 넣고 싶지 않은 재료를 골라주세요.',
        o: ['스팸', '파워에이드', '김치', '순대', '라자냐', '돌맹이'],
      },
      {
        q: '하루에 인터넷을 얼마나 사용하나요?',
        o: [
          '1시간 미만',
          '1시간 ~ 2시간',
          '3시간 ~ 4시간',
          '100년',
          '진짜 완전 많이 해',
        ],
      },
      {
        q: '하루에 몇 번 손을 씻나요?',
        o: [
          '매우 동의한다',
          '조금 동의한다',
          '보통이다',
          '별로 동의하지 않는다',
          '전혀 동의하지 않는다',
          '한 번 이상',
        ],
      },
      {
        q: '가장 좋아하는 잼을 골라주세요',
        o: ['딸기잼', '블루베리잼', '포도잼', '딸기잼', '무화과잼', '복숭아잼'],
      },
      {
        q: '눈 내리는 날 무엇을 하고 싶나요?',
        o: [
          '눈사람 만들기',
          '창 밖 눈 구경하기',
          '눈길 걷기',
          '과제하기',
          '저주하기',
        ],
      },
      {
        q: '쌱빇l慄I渥跳勁I5捕%뎧멜U?~苑裕F┾?',
        o: [
          '뼉츽;삒+f씧',
          '꽝啖塞脂잶',
          '쎒갞퍣K귑┠찚',
          '뺕쳋O豪%f퓸',
          '6개',
          '뙦뭶º油끇j칌?',
        ],
      },
      {
        q: '가끔 다른 사람의 생각이 귀로 들릴 때가 있나요?',
        o: [
          '매우 그렇다',
          '약간 그렇다',
          '보통이다',
          '그렇지 않다',
          '전혀 그렇지 않다',
        ],
      },
      {
        q: '가장 좋아하는 노래가 있다면, 몇 번이고 계속 반복해서 들을 수 있나요?',
        o: [
          '매우 그렇다',
          '약간 그렇다',
          '보통이다',
          '그렇지 않다',
          '전혀 그렇지 않다',
        ],
      },
      {
        q: '도서관에서 눈길이 가는 책을 발견했습니다. 어떤 책이을까요?',
        o: ['소설', '시집', '백과사전', '만화', '문제집', '설명서'],
      },
      {
        q: '마음에 드는 무게를 선택해 주세요',
        o: ['0.2mg', '20g', '3.7lbs', '20t', '-6kg'],
      },
      {
        q: '유령이 실제한다고 생각하나요?',
        o: [
          '매우 그렇다',
          '약간 그렇다',
          '보통이다',
          '그렇지 않다',
          '전혀 그렇지 않다',
        ],
      },
    ];

    for (let i = 1; i <= this.size; i++) {
      const q = this.#getRandomQuestion();
      q.a = -1;
      this.data[i] = q;
    }
  }

  #getRandomQuestion() {
    let n = Math.floor(Math.random() * this.pool.length);
    while (this.used.includes(n)) {
      n = Math.floor(Math.random() * this.pool.length);
    }
    this.used.push(n);
    return this.pool[n];
  }

  get(n) {
    return this.data[n];
  }

  set(n, a) {
    this.data[n].a = a;
  }
}

function render() {
  const image1 = document.querySelector('#image-test1');
  const image2 = document.querySelector('#image-test2');
  const image3 = document.querySelector('#image-test3');
  const image4 = document.querySelector('#image-test4');
  const imagec3 = document.querySelector('#image-test-c3');

  const cnv = document.createElement('canvas');
  cnv.width = 2000;
  cnv.height = 2000;
  const cnvP = new Permaphic(cnv);

  const cnvpre = document.querySelector('#canvas-preview');
  cnvpre.width = cnvpre.offsetWidth;
  cnvpre.height = cnvpre.offsetHeight;
  const cnvpreP = new Permaphic(cnvpre);

  const cnvgen = document.querySelector('#canvas-graphic');
  cnvgen.width = cnvgen.offsetWidth * 2;
  cnvgen.height = cnvgen.offsetHeight * 2;
  const cnvgenP = new Permaphic(cnvgen);

  cnvP.image(image4, 0, 0, 2000, 2000, 'cover');
  cnvP.ctx.globalCompositeOperation = 'color-dodge';
  cnvP.ctx.filter = 'blur(20px)';
  cnvP.image(image1, 0, 0, 2000, 2000, 'cover');
  cnvP.ctx.globalCompositeOperation = 'difference';
  cnvP.ctx.filter = 'none';
  cnvP.image(imagec3, 0, 0, 2000, 2000, 'cover');
  cnvP.ctx.globalCompositeOperation = 'source-over';
  cnvP.ctx.filter = 'none';
  cnvP.ctx.fillStyle = 'rgb(255,255,0)';
  cnvP.ctx.font = '100px Galmuri11';
  cnvP.ctx.fillText('테스트 이미지 생성', 700, 800);
  cnvpreP.image(cnvP.canvas, 0, 0, cnvpre.width, cnvpre.height, 'cover');
  cnvgenP.image(cnvP.canvas, 0, 0, cnvgen.width, cnvgen.height, 'cover');
}

async function delay(ms = 0) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
