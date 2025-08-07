// script.js
if('serviceWoker' in navigator){
  navigator.serviceWorker.register('sw.js')
  .then(()=>console.log("service Worker Registered"))
  .catch(err=> console.error("service Worker Failed",err))
}
// ———————————— تفعيل التبويبات ————————————

function showTab(tabld){
  //اخفاء جميع تبويبات
  const tabs=document.querySelectorAll('.tab');
  tabs.forEach(tab=> tab.style.display='none');
  //اظهار التبويبة المطلوبة فقط
 const selectedTab =
 document.getElementById(tabld);
 if(selectedTab){
   selectedTab.style.display='block';
 }
 }
//اظهار تبويبة تمارين اولا عند تحميل صفحة
window.onload=()=>{
  showTab('workout')
};

// ———————————— الذكاء الاصطناعي البسيط ————————————

const aiInput = document.getElementById('ai-input');
const aiSend = document.getElementById('ai-send');
const aiResponse = document.getElementById('ai-response');

// قاعدة أسئلة وأجوبة بسيطة جداً (يمكن تطويرها لاحقاً)
const aiKnowledgeBase = {
' ما هو التمرين الأفضل؟': 'أفضل التمارين هي التي تناسب هدفك ومستوى لياقتك.',
'  كم عدد السعرات التي يجب أن أتناول؟': 'السعرات تعتمد على هدفك، لكن متوسط الرجل يحتاج 2500 سعر حراري يومياً.',
 ' كيف أزيد قوتي؟': 'زيادة القوة تحتاج تدريب منتظم مع تناول بروتين كافٍ وراحة مناسبة.',
 ' متى وقت الصلاة؟': 'يمكنك الاطلاع على تبويب تذكير الصلاة لمواقيت اليوم.',
 ' ماذا عن الضغطات؟': 'يمكنك استخدام عداد Push-Up لتتبع عدد الضغطات التي تقوم بها يومياً.'
};

aiSend.addEventListener('click', () => {
  const question = aiInput.value.trim();
  if (!question) {
    aiResponse.textContent = 'يرجى كتابة سؤال أولاً.';
    return;
  }

  // بحث في قاعدة المعرفة ببساطة (يبحث على تطابق كامل أو جزئي)
  let answer = 'عذراً، لم أفهم السؤال. حاول صياغته بطريقة أخرى.';
  for (const key in aiKnowledgeBase) {
    if (question.includes(key) || key.includes(question)) {
      answer = aiKnowledgeBase[key];
      break;
    }
  }
  aiResponse.textContent = answer;
  aiInput.value = '';
});


// ———————————— عداد الضغطات Push-Up ————————————

let pushupCount = 0;
const pushupDisplay = document.getElementById('pushup-count');

window.incrementPushup = function () {
  pushupCount++;
  pushupDisplay.textContent = pushupCount;
};


// ———————————— جلب مواقيت الصلاة ————————————

// هذه الدالة تستخدم API مجانية لأوقات الصلاة (يمكنك استبدالها حسب موقعك)
function loadPrayerTimes() {
    const prayerTimes = {
      Fajr: "04:10",
      Dhuhr: "12:40",
      Asr: "16:15",
      Maghrib: "19:45",
      Isha: "21:00"
    };
  
    const prayerContainer = document.getElementById("prayer-times");
    prayerContainer.innerHTML = ""; // مسح المحتوى القديم إن وُجد
  
    for (const [name, time] of Object.entries(prayerTimes)) {
      const p = document.createElement("p");
      p.textContent = `${name}: ${time}`;
      prayerContainer.appendChild(p);
    }
  }
  loadPrayerTimes();


    let pushupTimer;
let pushupTimeLeft = 2 * 60 * 60; // ساعتان بالثواني

function startPushupReminder() {
  updatePushupDisplay();

  pushupTimer = setInterval(() => {
    pushupTimeLeft--;

    if (pushupTimeLeft <= 0) {
      clearInterval(pushupTimer);
      document.getElementById('pushup-countdown').textContent = '💪 حان وقت الضغط!';
      alert('💪 حان وقت الضغط!');
      return;
    }

    updatePushupDisplay();
  }, 1000); // يحدث كل ثانية
}

function updatePushupDisplay() {
  const hours = Math.floor(pushupTimeLeft / 3600);
  const minutes = Math.floor((pushupTimeLeft % 3600) / 60);
  const seconds = pushupTimeLeft % 60;

  document.getElementById('pushup-countdown').textContent =
    `التالي خلال: ${hours}س ${minutes}د ${seconds}ث`;
}

// زر إعادة العداد
const reminderKey = "pushUpReminderTime";

function setNextReminder() {
  const now = new Date();
  const nextReminder = new Date(now.getTime() + 2 * 60 * 60 * 1000); // ساعتين
  localStorage.setItem(reminderKey, nextReminder.getTime());
}

function checkPushUpReminder() {
  const savedTime = localStorage.getItem(reminderKey);

  if (savedTime) {
    const now = new Date();
    const reminderTime = new Date(parseInt(savedTime));
    const timeLeft = reminderTime - now;

    if (timeLeft > 0) {
      startCountdown(timeLeft);
    } else {
      alert("🟢 حان وقت القيام بالضغط!");
      setNextReminder(); // إعادة تعيين العداد
      checkPushUpReminder(); // إعادة التشغيل
    }
  } else {
    setNextReminder(); // أول تشغيل
    checkPushUpReminder(); // ثم التشغيل
  }
}

let countdownInterval;

function startCountdown(duration) {
  clearInterval(countdownInterval);
  let timeLeft = duration;

  countdownInterval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      alert("🟢 حان وقت القيام بالضغط!");
      setNextReminder();
      checkPushUpReminder();
    } else {
      timeLeft -= 1000;

      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      document.getElementById("pushup-timer").textContent =
        `${hours}h ${minutes}m ${seconds}s`;
    }
  }, 1000);
}

document.getElementById("reset-pushup").addEventListener("click", () => {
  setNextReminder();
  checkPushUpReminder();
});

// 👇 هذا يشغّل العداد عند فتح الموقع
checkPushUpReminder();



const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-btn");

let isPlaying = false;



function toggleMenu() {
  const nav = document.getElementById("nav-links");
  nav.classList.toggle("show");
}


// كود زر الهمبرغر
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.createElement('div');
  toggle.className = 'menu-toggle';
  toggle.innerHTML = '<span></span><span></span><span></span>';
  document.querySelector('.navbar').prepend(toggle);

  toggle.addEventListener('click', () => {
    document.querySelector('.navbar').classList.toggle('active');
  });
});


