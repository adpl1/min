// app.js
const auth = firebase.auth();
const db   = firebase.firestore();
const rdb  = firebase.database();
const stor = firebase.storage();

// حماية الصفحات المحمية
if (document.querySelector('.requires-auth')) {
  auth.onAuthStateChanged(user => {
    if (!user) location.href = 'index.html'; // توجيه إلى صفحة تسجيل الدخول إن لم يكن المستخدم مسجل دخول
  });
}

// تسجيل الدخول
if (document.getElementById('indexBtn')) {
  document.getElementById('indexBtn').addEventListener('click', () => {
    const email = document.getElementById('email').value.trim();
    const pass  = document.getElementById('password').value;
    auth.signInWithEmailAndPassword(email, pass)
      .then(() => location.href = 'home.html') // بعد الدخول الناجح، الانتقال إلى الصفحة الرئيسية
      .catch(e => alert(e.message));
  });
}

// إنشاء الحساب
if (document.getElementById('signupBtn')) {
  document.getElementById('signupBtn').addEventListener('click', () => {
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const phone   = document.getElementById('phone').value.trim();
    const pass    = document.getElementById('password').value;
    const confirm = document.getElementById('confirm').value;
    
    if (!name || !email || !phone || !pass || pass !== confirm) {
      return alert('تأكد من تعبئة جميع الحقول ومطابقة كلمة المرور');
    }

    auth.createUserWithEmailAndPassword(email, pass)
      .then(({ user }) => {
        return rdb.ref('users/' + user.uid).set({ name, email, phone });
      })
      .then(() => location.href = 'index.html') // الانتقال إلى صفحة تسجيل الدخول بعد التسجيل
      .catch(e => alert(e.message));
  });
}

// صفحة الحساب - تحميل بيانات المستخدم
if (document.querySelector('.account-page')) {
  const uiName  = document.getElementById('userName');
  const uiEmail = document.getElementById('userEmail');
  const uiPhone = document.getElementById('userPhone');

  auth.onAuthStateChanged(user => {
    if (!user) return;
    rdb.ref('users/' + user.uid).once('value').then(snap => {
      const d = snap.val() || {};
      uiName.textContent  = d.name  || '';
      uiEmail.textContent = d.email || '';
      uiPhone.textContent = d.phone || '';
    });
  });

  // زر تسجيل الخروج من صفحة الحساب
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      auth.signOut().then(() => location.href = 'index.html');
    });
  }
}
