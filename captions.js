/* ─────────────────────────────────────────────────────────────
   ALTYAZILAR / CAPTIONS — düzenlenebilir.
   start / end: ana zaman çizelgesindeki saniye.
   note: öğretmen için önerilen seslendirme cümlesi (ekranda görünmez).
   `npm run srt` bu dosyadan .srt üretir.
   ───────────────────────────────────────────────────────────── */
(function (root) {
  const CAPTIONS = [
    { scene: 1, start: 2.8, end: 6.2, tr: 'Nokta bir yer gösterir', en: 'A point marks a place',
      note: 'Kalemin ucunu kâğıda değdirdik: bir nokta. Nokta bir yer gösterir; ne kadar yaklaşırsak yaklaşalım büyümez, boyutu yoktur.' },
    { scene: 1, start: 6.6, end: 10.4, tr: 'Büyük harfle adlandırılır', en: 'Named with a capital letter',
      note: 'Noktaları A, B, C gibi büyük harflerle adlandırırız. Bu, A noktası.' },
    { scene: 2, start: 13.6, end: 17.4, tr: 'Cetvelle iki noktayı birleştir', en: 'Join two points with a ruler',
      note: 'A ile B arasına pek çok çizgi çizebiliriz ama düz olanı cetvelle çizeriz.' },
    { scene: 2, start: 18.0, end: 21.6, tr: 'Doğru parçası: [AB]', en: 'Line segment: [AB]',
      note: 'İki nokta arasındaki düz çizgiye doğru parçası denir; [AB] diye yazılır.' },
    { scene: 2, start: 22.0, end: 26.2, tr: 'İki ucu var, uzunluğu ölçülür', en: 'Two endpoints, it can be measured',
      note: 'Doğru parçasının iki uç noktası vardır. Cetvelle uzunluğunu ölçebiliriz: 8 santimetre.' },
    { scene: 3, start: 33.2, end: 36.6, tr: 'Işın: [AB', en: 'Ray: [AB',
      note: 'B noktasında durmayıp aynı yönde devam edersek bir ışın elde ederiz: [AB diye yazılır.' },
    { scene: 3, start: 36.9, end: 39.6, tr: 'Bir ucu var, bir yönde sonsuz', en: 'One endpoint, endless one way',
      note: 'Işının başlangıç noktası A’dır; öbür yönde sonsuza gider. Bu yüzden uzunluğu ölçülemez.' },
    { scene: 4, start: 42.2, end: 46.0, tr: 'Doğru: iki yönde sonsuz', en: 'Line: endless both ways',
      note: 'Her iki yönde de sonsuza uzanırsa doğru olur. Doğrunun başı da sonu da yoktur.' },
    { scene: 4, start: 47.2, end: 50.4, tr: 'Bir noktadan sonsuz doğru geçer', en: 'Endless lines pass through one point',
      note: 'Tek bir noktadan istediğimiz kadar çok doğru çizebiliriz. Sayısı sonsuzdur.' },
    { scene: 4, start: 50.8, end: 53.8, tr: 'İki noktadan tek doğru geçer', en: 'Only one line through two points',
      note: 'Ama iki noktadan yalnızca bir doğru geçer. Başka örneklerle deneyin: hep tek doğru!' },
    { scene: 5, start: 56.6, end: 60.4, tr: 'Açı: başlangıcı ortak iki ışın', en: 'Angle: two rays, one start',
      note: 'Başlangıç noktası ortak olan iki ışın bir açı oluşturur.' },
    { scene: 5, start: 60.8, end: 63.4, tr: 'Köşe B, kollar [BA ve [BC', en: 'Vertex B, arms [BA and [BC',
      note: 'Ortak noktaya köşe, ışınlara kol denir. Bu açı ABC açısıdır.' },
    { scene: 5, start: 64.6, end: 69.4, tr: 'Gönye ile dikme: dik açı', en: 'Set square: perpendicular, right angle',
      note: 'P noktasından d doğrusuna gönye ile dikme çizeriz. Dikmenin oluşturduğu açı dik açıdır.' },
    { scene: 6, start: 72.4, end: 75.8, tr: 'Pergel ile çember', en: 'A compass draws a circle',
      note: 'Pergelin iğnesini merkeze koyup 3 cm açıyoruz ve bir tur döndürüyoruz.' },
    { scene: 6, start: 76.4, end: 80.2, tr: 'Her noktası merkeze eşit uzaklıkta', en: 'Every point equally far from the centre',
      note: 'Çemberin her noktası merkezden aynı uzaklıktadır. Bu uzaklığa yarıçap denir.' },
    { scene: 6, start: 80.6, end: 85.4, tr: 'Çap = 2 × yarıçap', en: 'Diameter = 2 × radius',
      note: 'Merkezden geçen ve iki ucu çember üzerinde olan doğru parçası çaptır; yarıçapın iki katıdır.' },
    { scene: 7, start: 86.6, end: 91.4, tr: 'Hangi çizim, hangi araçla?', en: 'Which tool draws which?',
      note: 'Hangi çizimi hangi araçla yaptık? Cetvel, gönye, pergel.' },
    { scene: 7, start: 93.2, end: 98.0, tr: 'Geometri bir noktayla başlar', en: 'Geometry begins with a point',
      note: 'Bütün bu çizimler tek bir noktayla başladı. Siz de kendi resminizi çizin!' },
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = CAPTIONS;
  else { root.LI = root.LI || {}; root.LI.CAPTIONS = CAPTIONS; }
})(typeof window !== 'undefined' ? window : globalThis);
