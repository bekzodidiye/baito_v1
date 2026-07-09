import React from 'react';
import { 
  ArrowLeft, 
  Share2, 
  MoreVertical, 
  Calendar, 
  Timer, 
  DollarSign, 
  Zap, 
  Truck, 
  MapPin, 
  ClipboardList, 
  CheckCircle, 
  AlertTriangle, 
  Send, 
  Clock,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';
import { Job } from '../../types';
import { useApp } from '../../context/AppContext';

interface JobSearchModalDetailProps {
  selectedJob: Job;
  setSelectedJob: (job: Job | null) => void;
  toggleBookmark: (id: string) => void;
  applyToJob: (id: string) => void;
}

// Helper to get custom Unsplash hero photos for each type of job
export const getJobHeroImage = (job: Job) => {
  const lower = job.title.toLowerCase();
  if (lower.includes('qurilish')) {
    return 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&auto=format&fit=crop&q=80';
  }
  if (lower.includes('ko\'chirish') || lower.includes('tashuvchi')) {
    return 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80';
  }
  if (lower.includes('sement') || lower.includes('vagon')) {
    return 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80';
  }
  if (lower.includes('pomidor') || lower.includes('terish')) {
    return 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?w=600&auto=format&fit=crop&q=80';
  }
  if (lower.includes('tozalash') || lower.includes('butash') || lower.includes('hovli')) {
    return 'https://images.unsplash.com/photo-1592150621744-aca64f48394a?w=600&auto=format&fit=crop&q=80';
  }
  if (lower.includes('mebel') || lower.includes('yig\'ish')) {
    return 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=600&auto=format&fit=crop&q=80';
  }
  if (lower.includes('ariq') || lower.includes('kabel') || lower.includes('qazish')) {
    return 'https://images.unsplash.com/photo-1508450859948-4e04f9ad5657?w=600&auto=format&fit=crop&q=80';
  }
  if (lower.includes('to\'yxona') || lower.includes('idish') || lower.includes('stol')) {
    return 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600&auto=format&fit=crop&q=80';
  }
  if (lower.includes('restoran') || lower.includes('yuvish')) {
    return 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80';
  }
  if (lower.includes('gilos') || lower.includes('o\'rik') || lower.includes('bog\'')) {
    return 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=600&auto=format&fit=crop&q=80';
  }
  return job.logoUrl || 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=80';
};

// Helper for authentic tasks & requirements
export const getJobDetails = (title: string) => {
  const lower = title.toLowerCase();
  if (lower.includes('qurilish') || lower.includes('usta')) {
    return {
      tasks: [
        "G'isht, gipsokarton va boshqa qurilish materiallarini tashish",
        "Qurilish qorishmalarini tayyorlash va yetkazib berish",
        "Ish tugagandan so'ng hududni tozalash va asboblarni yig'ish"
      ],
      requirements: [
        "Jismoniy baquvvat va chaqqon bo'lish",
        "Ish beruvchining ko'rsatmalariga aniq amal qilish",
        "Maxsus kiyim yoki qulay poyabzalda kelish"
      ],
      warning: "Qurilish qoidalariga va xavfsizlikka qat'iy rioya qiling. Bosh kiyim (kaska) kiyish tavsiya etiladi."
    };
  }
  if (lower.includes('ko\'chirish') || lower.includes('tashuvchi') || lower.includes('yuk')) {
    return {
      tasks: [
        "Mebel, qutilar va maishiy texnikalarni xonadondan tushirish",
        "Yuklarni yuk mashinasiga tartib bilan joylashtirish",
        "Yangi manzilda yuklarni ehtiyotkorlik bilan olib kirish"
      ],
      requirements: [
        "Ehtiyotkorlik va yuklarga zarar yetkazmaslik",
        "Og'ir yuk ko'tarishga jismoniy tayyorgarlik",
        "Jamoada tezkor va kelishib ishlash"
      ],
      warning: "Mebel va texnikalarni tirnab yoki shikastlab qo'ymaslik uchun o'ta ehtiyot bo'ling."
    };
  }
  if (lower.includes('sement') || lower.includes('vagon')) {
    return {
      tasks: [
        "Vagondan 50 kg lik sement qoplarini navbat bilan tushirish",
        "Qoplarni omborda ko'rsatilgan joyga tartib bilan taxlash",
        "Siniq yoki yirtilgan qoplar bo'lsa, ularni alohida ajratish"
      ],
      requirements: [
        "O'ta yuqori jismoniy chidamlilik",
        "Changdan himoyalanish uchun respirator yoki niqob taqish",
        "Ish jarayonida jarohat olmaslik uchun himoya qo'lqopi"
      ],
      warning: "Sement changi ko'z va nafas yo'llariga zarar yetkazmasligi uchun himoya vositalaridan foydalanish shart."
    };
  }
  if (lower.includes('pomidor') || lower.includes('terish') || lower.includes('gilos') || lower.includes('o\'rik') || lower.includes('bog\'')) {
    return {
      tasks: [
        "Ekinlar orasidan pishgan mevalarni ehtiyotkorlik bilan terish",
        "Saralab, maxsus plastik yoki yog'och yashiklarga joylash",
        "Zararlangan yoki chirigan mevalarni alohida chetga ajratish"
      ],
      requirements: [
        "Ehtiyotkorlik (mevalarni ezib qo'ymaslik lozim)",
        "Issiq haroratda uzoq vaqt ishlay olish qobiliyati",
        "Tezkorlik va chaqqon qo'llar"
      ],
      warning: "Daraxt va ekin shoxlarini sindirib qo'ymaslikka hamda saralash sifatiga jiddiy e'tibor bering."
    };
  }
  if (lower.includes('tozalash') || lower.includes('butash') || lower.includes('hovli')) {
    return {
      tasks: [
        "Hovli hududidagi begona o'tlarni tozalash va sug'orish",
        "Butalgan daraxt shoxlarini yig'ish va mashinaga ortish",
        "Yo'laklar va hovli maydonini supirib, tartibga keltirish"
      ],
      requirements: [
        "Bog'dorchilik asboblari bilan ishlash tajribasi",
        "Chaqqonlik va tozalikka e'tiborlilik",
        "Qo'lqop va qulay kiyimda kelish"
      ],
      warning: "Daraxt shoxlarini arralashda o'ta ehtiyot bo'ling va elektr simlariga tegmang."
    };
  }
  if (lower.includes('mebel') || lower.includes('yig\'ish')) {
    return {
      tasks: [
        "Mebel detallarini tushirish va usta aytgan xonaga kiritish",
        "Ustaga asboblarni uzatib turish va mebel qismlarini ushlab turish",
        "Tayyor bo'lgan mebellarni tozalash va qutilarini yig'ishtirish"
      ],
      requirements: [
        "Asboblar bilan ishlash bo'yicha boshlang'ich tushuncha",
        "Diqqat bilan ko'rsatmalarni bajarish",
        "Xushmuomalalik va usta bilan kelishuv"
      ],
      warning: "Mebel yuzalarini o'tkir asboblar bilan tirnab yuborishdan ehtiyot bo'ling."
    };
  }
  if (lower.includes('ariq') || lower.includes('kabel') || lower.includes('qazish')) {
    return {
      tasks: [
        "Belgilangan chiziq bo'ylab kerakli chuqurlikda ariq qazish",
        "Kabel yotqizish jarayonida simlarni tekislash va yordam berish",
        "Kabel ustidan qum va tuproq tortib, qayta ko'mib silliqlash"
      ],
      requirements: [
        "Kurak va ketmon bilan ishlashga jismoniy tayyorgarlik",
        "Kabel liniyalariga shikast yetkazmaslik uchun ehtiyotkorlik",
        "Sariq nimcha yoki maxsus kiyimda ishlash"
      ],
      warning: "Er ostidagi boshqa aloqa yoki gaz quvurlariga duch kelsangiz, darhol ishni to'xtatib xabar bering."
    };
  }
  if (lower.includes('to\'yxona') || lower.includes('idish') || lower.includes('yig\'ish') || lower.includes('stol')) {
    return {
      tasks: [
        "To'y tugagandan keyin stollardagi qolgan idishlarni yig'ish",
        "Dasturxonlarni almashtirish va stullarni tartibga keltirish",
        "Zaldagi chiqindilarni yig'ib, umumiy tozalikka yordamlashish"
      ],
      requirements: [
        "Xushmuomalalik va jamoada tezkor harakat qilish",
        "Idishlarni sindirmaslik uchun ehtiyotkorlik",
        "Kechki yoki tungi smenada ishlay olish"
      ],
      warning: "Chinni va shisha idishlarni tashishda sinish xavfi yuqoriligi bois o'ta ehtiyotkor bo'ling."
    };
  }
  if (lower.includes('restoran') || lower.includes('yuvish')) {
    return {
      tasks: [
        "Katta qozon, tova va laganlarni maxsus vositalar bilan yuvish",
        "Yuvilgan idishlarni quriting va javonlarga tartib bilan taxlang",
        "Oshxona pol qismini supirib-sidirish va chiqindilarni tozalash"
      ],
      requirements: [
        "Idishlarni toza va gigiyena qoidalariga mos yuvish",
        "Ishchanlik va nam muhitda uzoq tura olish",
        "Mas'uliyatlilik va tezkorlik"
      ],
      warning: "Issiq suv va kimyoviy yuvish vositalaridan foydalanishda qo'llaringizni himoyalang."
    };
  }
  return {
    tasks: [
      "Yuklarni qabul qilish, saralash va belgilangan joyga joylash",
      "Ombor ichida mahsulotlarni xavfsiz tashish va ortish",
      "Inventarizatsiya jarayonida hisob-kitobga yordam berish"
    ],
    requirements: [
      "Jismoniy baquvvat va chaqqon bo'lishi lozim",
      "Mas'uliyatlilik, aniqlik va jamoaviy intizom",
      "Ish tugagach hisob-kitobni to'g'ri topshirish"
    ],
    warning: "Xavfsizlik qoidalariga qat'iy amal qiling. Ish joyida maxsus himoya poyabzalida bo'lish shart."
  };
};

export const JobSearchModalDetail: React.FC<JobSearchModalDetailProps> = ({
  selectedJob,
  setSelectedJob,
  toggleBookmark,
  applyToJob,
}) => {
  const { setCurrentScreen, setMapFocusedJobId } = useApp();
  const jobDetails = getJobDetails(selectedJob.title);

  const handleApplyClick = () => {
    applyToJob(selectedJob.id);
    setSelectedJob({ ...selectedJob, applied: true, status: 'applied' });
  };

  return (
    <div className="fixed inset-0 z-100 flex items-end md:items-center justify-center p-0 md:p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedJob(null)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative bg-[#f9f9f9] w-full md:max-w-md rounded-t-3xl md:rounded-2xl shadow-2xl flex flex-col h-[90vh] md:h-[85vh] overflow-hidden z-10"
      >
        {/* Sticky Header */}
        <div className="shrink-0 h-14 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center px-4 justify-between sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedJob(null)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-[#000666] transition-colors cursor-pointer"
            >
              <ArrowLeft size={20} className="stroke-[2.5]" />
            </button>
            <h1 className="text-[16px] font-bold text-[#000666] tracking-tight">Ish tafsilotlari</h1>
          </div>
          <div className="flex items-center gap-1">
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer">
              <Share2 size={16} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer">
              <MoreVertical size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto pb-6 no-scrollbar">
          {/* Hero Image Section */}
          <section className="relative w-full aspect-[4/3] overflow-hidden shrink-0">
            <img 
              className="w-full h-full object-cover" 
              src={getJobHeroImage(selectedJob)} 
              alt={selectedJob.title} 
            />
            {/* Urgent / Time Left Badge */}
            <div className="absolute top-4 left-4 bg-[#ba1a1a] text-white px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
              <Clock size={13} className="stroke-[2.5]" />
              <span className="text-[11px] font-bold tracking-tight">
                {selectedJob.durationLabel || "1 kunlik"} qoldi
              </span>
            </div>
          </section>

          {/* Overlapping Content Container */}
          <div className="px-4 -mt-6 relative z-10">
            {/* Core Info Card */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/90">
              <div className="flex flex-col gap-1 mb-4">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  {selectedJob.company}
                </span>
                <h2 className="text-[17px] font-bold text-[#000666] leading-snug tracking-tight">
                  {selectedJob.title}
                </h2>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="bg-[#91f78e]/30 text-[#00731e] px-2.5 py-1 rounded-lg text-[11px] font-semibold">
                  {selectedJob.durationLabel || "1 kunlik"} muddatgacha
                </span>
                {selectedJob.tags.slice(1, 3).map((tag, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-[11px] font-semibold">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Bento Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Sana */}
                <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                    <Calendar size={14} className="text-slate-400" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">Sana</span>
                  </div>
                  <p className="text-[12px] font-bold text-[#000666]">
                    {selectedJob.periodText ? selectedJob.periodText.split(' ')[0] : '2026-07-09'}
                  </p>
                </div>

                {/* Vaqt */}
                <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                    <Timer size={14} className="text-slate-400" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">Vaqt</span>
                  </div>
                  <p className="text-[11px] font-bold text-[#000666] truncate">
                    {selectedJob.periodText ? selectedJob.periodText.split(' ')[1] || "08:00~17:00" : '08:00~17:00'}
                  </p>
                </div>

                {/* Maosh */}
                <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                    <DollarSign size={14} className="text-slate-400" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">Maosh</span>
                  </div>
                  <p className="text-[12px] font-bold text-[#000666] truncate">{selectedJob.salary}</p>
                </div>

                {/* Soatlik */}
                <div className="bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                    <Zap size={14} className="text-slate-400" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider">Soatlik</span>
                  </div>
                  <p className="text-[12px] font-bold text-[#000666] truncate">
                    {selectedJob.hourlyRate && selectedJob.hourlyRate !== "Yo'q" ? `${selectedJob.hourlyRate} so'm` : "25 000 so'm"}
                  </p>
                </div>
              </div>

              {/* Transport xarajatlari */}
              <div className="mt-4 flex items-center justify-between p-3 bg-[#000666]/5 rounded-xl border border-[#000666]/5">
                <div className="flex items-center gap-2.5">
                  <Truck size={15} className="text-[#000666]" />
                  <span className="text-[12px] font-medium text-slate-700">Transport xarajatlari</span>
                </div>
                <span className="text-[12px] font-bold text-[#000666]">
                  {selectedJob.transportRate && selectedJob.transportRate !== "Yo'q" && !selectedJob.transportRate.includes('xarajat')
                    ? (selectedJob.transportRate.includes('so\'m') || selectedJob.transportRate.includes('Yotoq') || selectedJob.transportRate.includes('Bepul') ? selectedJob.transportRate : `${selectedJob.transportRate} so'm`)
                    : selectedJob.transportRate || "15 000 so'm"}
                </span>
              </div>
            </div>

            {/* Manzil */}
            <section className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-[#000666] tracking-tight">Manzil</h3>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(selectedJob.location)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-blue-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  Xaritada ko'rish <ExternalLink size={11} />
                </a>
              </div>
              <div className="flex items-start gap-2.5 mb-3">
                <MapPin size={16} className="text-[#000666] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-800 leading-tight">{selectedJob.location}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Toshkent shahar hududi bo'yicha</p>
                </div>
              </div>

              {/* Interactive Map Image */}
              <div className="w-full h-36 rounded-xl overflow-hidden border border-slate-100 relative shadow-xs">
                <div 
                  className="w-full h-full bg-cover bg-center" 
                  style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC4yiyP02nhU2y5DSPZ7dWqVKCO_6MX_-rrTlqlIVJtaJ75gDIS3Edm6J-W_t-rr9VGO2lPwCZ_61fCv6BBQnjaPoc2EwlvxJ130v8x7wHKwOYqfQ-yxlkHY4w_F41J0HKfbGxoLdFMh4mtvCd1-uo01JyzPJiAxKMMQJFbFtyogjiebJa4yNcfScdsxp2MQTqN4_ofzr5ZEUCUbUd6JlkShsTHLT6GSg0Zc1Hiwl1wr66uWlxx9s-8')` }}
                />
                <div className="absolute inset-0 bg-black/5 flex items-center justify-center pointer-events-none">
                  <div className="w-9 h-9 bg-[#000666] rounded-full flex items-center justify-center text-white shadow-md ring-4 ring-[#000666]/20">
                    <MapPin size={16} />
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMapFocusedJobId(selectedJob.id);
                    setCurrentScreen('xarita');
                    setSelectedJob(null);
                  }}
                  className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-bold text-blue-600 shadow-sm border border-slate-100 cursor-pointer"
                >
                  Xaritada ochish →
                </button>
              </div>
            </section>

            {/* Ish vazifalari */}
            <section className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <ClipboardList size={16} className="text-[#000666]" />
                <h3 className="text-sm font-bold text-[#000666] tracking-tight">Ish vazifalari</h3>
              </div>
              <div className="space-y-2">
                {jobDetails.tasks.map((task, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 transition-all hover:bg-slate-50"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#000666] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-xs text-slate-700 font-medium leading-tight">{task}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Talablar va shartlar */}
            <section className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={16} className="text-emerald-600" />
                <h3 className="text-sm font-bold text-[#000666] tracking-tight">Talablar va shartlar</h3>
              </div>
              <ul className="space-y-2 pl-1">
                {jobDetails.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#000666] mt-1.5 shrink-0"></span>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">{req}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Muhim eslatma */}
            <div className="mt-6 bg-[#ffdf9e]/30 text-[#261a00] p-4 rounded-xl border border-[#ffdf9e]/50 flex gap-2.5 items-start">
              <AlertTriangle size={18} className="text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-[#261a00] mb-0.5">Muhim eslatma</p>
                <p className="text-[11px] text-amber-950/90 leading-relaxed font-medium">
                  {jobDetails.warning}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer Action Bar */}
        <div className="shrink-0 bg-white/95 backdrop-blur-md border-t border-slate-100 p-4 flex items-center gap-3 sticky bottom-0 z-50">
          <button
            disabled={selectedJob.applied}
            onClick={handleApplyClick}
            className={`flex-1 text-white h-14 rounded-xl text-sm font-bold shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer ${
              selectedJob.applied
                ? 'bg-emerald-600 cursor-not-allowed opacity-90'
                : 'bg-[#000666] hover:bg-[#000666]/90'
            }`}
          >
            <Send size={15} />
            {selectedJob.applied ? 'Ariza topshirilgan' : 'Ariza topshirish'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

