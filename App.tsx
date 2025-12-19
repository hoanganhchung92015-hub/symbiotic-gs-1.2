
import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Image as ImageIcon, 
  Mic, 
  Send, 
  ChevronLeft,
  Zap,
  Loader2,
  BrainCircuit,
  XCircle,
  PlusCircle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { Subject, ModuleTab, AIResponse } from './types';
import { SUBJECT_CONFIG, TAB_CONFIG } from './constants';
import { generateStudyContent } from './services/geminiService';
import MermaidChart from './components/MermaidChart';

const App: React.FC = () => {
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [activeTab, setActiveTab] = useState<ModuleTab>(ModuleTab.SPEED);
  const [inputText, setInputText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showMcqAnswer, setShowMcqAnswer] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tabContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to active tab
  useEffect(() => {
    if (showResult && tabContainerRef.current) {
      const activeBtn = tabContainerRef.current.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement;
      if (activeBtn) {
        const containerWidth = tabContainerRef.current.offsetWidth;
        const btnOffset = activeBtn.offsetLeft;
        const btnWidth = activeBtn.offsetWidth;
        const scrollPos = btnOffset - (containerWidth / 2) + (btnWidth / 2);
        
        tabContainerRef.current.scrollTo({
          left: scrollPos,
          behavior: 'smooth'
        });
      }
    }
  }, [activeTab, showResult]);

  const handleSubjectSelect = (subject: Subject) => {
    if (subject === Subject.TIME) {
      alert("Chức năng theo dõi thời gian học tập đang được phát triển!");
      return;
    }
    setCurrentSubject(subject);
    resetState();
  };

  const resetState = () => {
    setAiResponse(null);
    setCapturedImage(null);
    setInputText('');
    setShowResult(false);
    setIsCameraActive(false);
    setSelectedOption(null);
    setShowMcqAnswer(false);
    setActiveTab(ModuleTab.SPEED);
  };

  const handleStartCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Không thể truy cập camera. Vui lòng kiểm tra quyền.");
      setIsCameraActive(false);
    }
  };

  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context?.drawImage(videoRef.current, 0, 0);
      setCapturedImage(canvasRef.current.toDataURL('image/jpeg'));
      stopCamera();
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setIsCameraActive(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setCapturedImage(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabContainerRef.current) {
      const scrollAmount = 150;
      tabContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleSubmit = async () => {
    if (!currentSubject || (!inputText && !capturedImage)) return;
    setIsAiLoading(true);
    try {
      const result = await generateStudyContent(currentSubject, inputText || "Hãy giải bài tập này cho tôi", capturedImage || undefined);
      setAiResponse(result);
      setShowResult(true);
      setSelectedOption(null);
      setShowMcqAnswer(false);
    } catch (error) {
      alert("Đã xảy ra lỗi khi kết nối với Symbiotic AI.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const renderHome = () => (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center gap-12 bg-slate-50">
      <div className="text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">Symbiotic AI</h1>
        <h2 className="text-2xl font-bold text-indigo-600 mt-1 uppercase tracking-wider">Multi Agent Systems</h2>
        <p className="text-slate-500 font-medium mt-4">Trợ lý học tập thông minh thế hệ mới cho học sinh Việt Nam</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        {(Object.keys(SUBJECT_CONFIG) as Subject[]).map((subj) => {
          const config = SUBJECT_CONFIG[subj as keyof typeof SUBJECT_CONFIG];
          return (
            <button
              key={subj}
              onClick={() => handleSubjectSelect(subj)}
              className={`flex flex-col items-center justify-center aspect-square rounded-3xl p-6 transition-all transform hover:scale-105 shadow-lg bg-gradient-to-br ${config.gradient} text-white`}
            >
              <div className="bg-white/20 p-4 rounded-2xl mb-4 backdrop-blur-sm">
                {config.icon}
              </div>
              <span className="font-bold text-lg uppercase tracking-wider">{config.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 text-sm text-slate-400 text-center space-y-1 opacity-50">
        <p className="font-semibold text-slate-500">Dự án KHKT 2025</p>
        <p>Thiết kế bởi nhóm AI Trường THPT Mai Sơn</p>
      </div>
    </div>
  );

  const renderSubjectView = () => {
    if (!currentSubject) return null;
    const config = SUBJECT_CONFIG[currentSubject];

    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <header className={`p-4 flex items-center justify-between text-white bg-gradient-to-r ${config.gradient} shadow-md sticky top-0 z-50`}>
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentSubject(null)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold uppercase tracking-tight">{config.label}</h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <Zap className="w-3 h-3 text-yellow-300 fill-yellow-300" /> Symbiotic AI
          </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-6 pb-40">
          {!showResult && !isAiLoading && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-8 flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 rounded-xl">
                    <BrainCircuit className="w-6 h-6 text-indigo-600" />
                  </div>
                  Phòng học thông minh
                </h3>

                {isCameraActive && (
                  <div className="relative mb-6 rounded-3xl overflow-hidden bg-black aspect-video shadow-2xl">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
                      <button onClick={captureFrame} className="bg-white text-slate-900 p-5 rounded-full shadow-2xl hover:scale-110 active:scale-90 transition-all">
                        <Camera className="w-7 h-7" />
                      </button>
                      <button onClick={stopCamera} className="bg-rose-500 text-white px-6 py-3 rounded-full font-bold text-sm uppercase tracking-widest shadow-2xl">
                        Hủy
                      </button>
                    </div>
                  </div>
                )}

                {capturedImage && !isCameraActive && (
                  <div className="relative mb-8 max-w-sm mx-auto group">
                    <img src={capturedImage} className="relative rounded-3xl border-4 border-white shadow-2xl w-full" />
                    <button 
                      onClick={() => setCapturedImage(null)}
                      className="absolute -top-4 -right-4 bg-rose-500 text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-all border-4 border-white"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <button onClick={handleStartCamera} className="flex flex-col items-center gap-3 py-6 bg-slate-50 rounded-[2rem] border-2 border-slate-100 hover:bg-white hover:border-indigo-300 transition-all group shadow-sm">
                    <Camera className="w-7 h-7 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Chụp ảnh</span>
                  </button>
                  <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center gap-3 py-6 bg-slate-50 rounded-[2rem] border-2 border-slate-100 hover:bg-white hover:border-emerald-300 transition-all group shadow-sm">
                    <ImageIcon className="w-7 h-7 text-slate-500 group-hover:text-emerald-600 transition-colors" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Thư viện</span>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                  </button>
                  <button onClick={() => alert("Ghi âm đang được tối ưu...")} className="flex flex-col items-center gap-3 py-6 bg-slate-50 rounded-[2rem] border-2 border-slate-100 hover:bg-white hover:border-rose-300 transition-all group shadow-sm">
                    <Mic className="w-7 h-7 text-slate-500 group-hover:text-rose-600 transition-colors" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Giọng nói</span>
                  </button>
                </div>

                <div className="space-y-8">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Nhập câu hỏi hoặc mô tả bài tập..."
                    className="w-full p-8 bg-slate-50/50 rounded-[2rem] text-lg font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-8 focus:ring-indigo-500/5 transition-all min-h-[180px] resize-none border-2 border-slate-100 focus:border-indigo-200"
                  />
                  
                  <div className="flex justify-center">
                    <button 
                      onClick={handleSubmit}
                      disabled={isAiLoading || (!inputText && !capturedImage)}
                      className={`group relative flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-bold text-base transition-all shadow-lg overflow-hidden ${
                        isAiLoading || (!inputText && !capturedImage)
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                        : 'bg-indigo-600 text-white hover:scale-105 active:scale-95 shadow-indigo-200/50'
                      }`}
                    >
                      <Sparkles className="w-5 h-5 text-yellow-300" />
                      <span className="uppercase tracking-wider">Thực hiện yêu cầu</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isAiLoading && (
            <div className="flex flex-col items-center justify-center py-24 space-y-10">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 rounded-full blur-[60px] opacity-20 animate-pulse"></div>
                <div className="relative bg-white p-12 rounded-full shadow-2xl border border-indigo-50">
                  <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
                </div>
              </div>
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Symbiotic AI</h3>
                <p className="text-slate-500 font-bold flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  Đang phân tích bài tập qua Multi Agents...
                </p>
              </div>
            </div>
          )}

          {showResult && aiResponse && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
              {/* Unified Content Card */}
              <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col">
                
                {/* Module Selection Slider Tray (Compact AT TOP) */}
                <div className="bg-slate-50/80 border-b border-slate-100 py-4 relative">
                  <div className="flex items-center justify-between mb-3 px-6">
                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.3em] flex items-center gap-2">
                       <Zap className="w-2.5 h-2.5 fill-indigo-600" /> Phòng học thông minh
                    </span>
                  </div>
                  
                  <div className="relative flex items-center px-2 group/slider">
                    {/* Compact Left Navigation Arrow */}
                    <button 
                      onClick={() => scrollTabs('left')}
                      className="shrink-0 bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-md border border-slate-100 hover:bg-white hover:scale-110 active:scale-95 transition-all text-indigo-600 z-10"
                    >
                      <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                    </button>

                    <div 
                      ref={tabContainerRef}
                      className="flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing select-none px-4 py-1.5 w-full items-center"
                      onMouseDown={(e) => {
                        const el = tabContainerRef.current;
                        if (!el) return;
                        el.classList.add('grabbing');
                        const startX = e.pageX - el.offsetLeft;
                        const scrollLeft = el.scrollLeft;
                        const onMouseMove = (moveEvent: MouseEvent) => {
                          const x = moveEvent.pageX - el.offsetLeft;
                          const walk = (x - startX) * 2;
                          el.scrollLeft = scrollLeft - walk;
                        };
                        const onMouseUp = () => {
                          window.removeEventListener('mousemove', onMouseMove);
                          window.removeEventListener('mouseup', onMouseUp);
                          el.classList.remove('grabbing');
                        };
                        window.addEventListener('mousemove', onMouseMove);
                        window.addEventListener('mouseup', onMouseUp);
                      }}
                    >
                      {(Object.keys(TAB_CONFIG) as ModuleTab[]).map((tab) => (
                        <button
                          key={tab}
                          data-tab={tab}
                          onClick={() => {
                            setActiveTab(tab);
                            setSelectedOption(null);
                            setShowMcqAnswer(false);
                          }}
                          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-bold text-[13px] uppercase tracking-wider transition-all whitespace-nowrap min-w-fit justify-center border ${
                            activeTab === tab 
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                            : 'bg-white text-slate-500 hover:text-indigo-600 border-slate-100 hover:border-indigo-100 shadow-sm'
                          }`}
                        >
                          <span className={`${activeTab === tab ? 'scale-110' : 'scale-100'} transition-transform duration-300`}>
                            {TAB_CONFIG[tab].icon}
                          </span>
                          {TAB_CONFIG[tab].label}
                        </button>
                      ))}
                    </div>

                    {/* Compact Right Navigation Arrow */}
                    <button 
                      onClick={() => scrollTabs('right')}
                      className="shrink-0 bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-md border border-slate-100 hover:bg-white hover:scale-110 active:scale-95 transition-all text-indigo-600 z-10"
                    >
                      <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-8 md:p-14 min-h-[450px]">
                  {activeTab === ModuleTab.SPEED ? (
                    <div className="space-y-12 animate-in fade-in duration-500">
                      <div className="bg-indigo-50/50 p-12 rounded-[2.5rem] border-2 border-indigo-100 relative group overflow-hidden shadow-inner">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                          <Zap className="w-32 h-32 text-indigo-900" />
                        </div>
                        <h4 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5" /> Đáp án đề xuất
                        </h4>
                        <div className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
                          {aiResponse.speed.answer}
                        </div>
                      </div>

                      <div className="pt-10 border-t border-slate-50">
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-10 flex items-center gap-3">
                           <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                           Câu hỏi luyện tập (Củng cố kiến thức)
                        </h4>
                        <p className="text-2xl font-bold text-slate-800 mb-10 leading-relaxed">{aiResponse.speed.similar.question}</p>
                        
                        <div className="grid gap-5 mb-10">
                          {aiResponse.speed.similar.options.map((opt, idx) => (
                            <button
                              key={idx}
                              disabled={showMcqAnswer}
                              onClick={() => setSelectedOption(idx)}
                              className={`w-full text-left p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between group ${
                                showMcqAnswer
                                  ? idx === aiResponse.speed.similar.correctIndex
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-md'
                                    : selectedOption === idx
                                      ? 'bg-rose-50 border-rose-500 text-rose-900'
                                      : 'opacity-40 grayscale pointer-events-none'
                                  : selectedOption === idx
                                    ? 'bg-indigo-50 border-indigo-600 shadow-xl ring-4 ring-indigo-50'
                                    : 'bg-white border-slate-100 hover:border-indigo-200'
                              }`}
                            >
                              <div className="flex items-center gap-6">
                                <span className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg border-2 ${
                                  selectedOption === idx ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-400'
                                }`}>
                                  {String.fromCharCode(65 + idx)}
                                </span>
                                <span className="text-xl font-bold">{opt}</span>
                              </div>
                            </button>
                          ))}
                        </div>

                        {!showMcqAnswer ? (
                          <div className="flex justify-center">
                            <button
                              onClick={() => setShowMcqAnswer(true)}
                              disabled={selectedOption === null}
                              className={`w-full max-w-lg py-6 rounded-[2rem] font-black text-xl transition-all shadow-2xl uppercase tracking-[0.2em] flex items-center justify-center gap-4 ${
                                selectedOption === null ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' : 'bg-slate-900 text-white hover:bg-black hover:scale-[1.03]'
                              }`}
                            >
                              Xác nhận đáp án
                              <ArrowRight className="w-6 h-6" />
                            </button>
                          </div>
                        ) : (
                          <div className="p-8 bg-emerald-100/50 rounded-[2.5rem] border-2 border-emerald-200 text-emerald-900 flex items-center gap-6 shadow-lg animate-in zoom-in duration-300">
                            <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg">
                              <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <div>
                              <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-2">Lời giải chính xác</p>
                              <p className="text-2xl font-black">{aiResponse.speed.similar.options[aiResponse.speed.similar.correctIndex]}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="scientific-text text-slate-700 leading-relaxed font-medium animate-in fade-in slide-in-from-left-6 duration-500">
                      {String((aiResponse as any)[activeTab])
                        ?.replace(/\*/g, '')
                        ?.split('\n').map((line, i) => (
                          <p key={i} className={line.trim() === '' ? 'h-8' : 'mb-10'}>{line}</p>
                        ))
                      }
                    </div>
                  )}
                </div>
              </div>

              {/* Mindmap Section */}
              <MermaidChart chart={aiResponse.mermaid} />

              {/* Action Area */}
              <div className="flex justify-center pt-8 pb-20">
                <button 
                  onClick={resetState}
                  className="flex items-center gap-5 px-16 py-8 bg-white text-indigo-600 font-black rounded-[2.5rem] shadow-2xl border-2 border-indigo-50 hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.3em] text-sm"
                >
                  <PlusCircle className="w-8 h-8" />
                  Đặt câu hỏi mới
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Floating Query Footer */}
        {showResult && (
          <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-3xl border-t border-slate-100 p-6 md:p-8 shadow-[0_-20px_50px_rgba(0,0,0,0.06)] z-40 animate-in slide-in-from-bottom-full duration-500">
            <div className="max-w-4xl mx-auto flex items-center gap-6">
              <div className="flex-1 relative group">
                <input 
                  type="text" 
                  placeholder="Hỏi AI thêm về nội dung bài học này..." 
                  className="w-full py-6 px-10 bg-slate-100 rounded-full text-lg font-bold placeholder:text-slate-400 focus:outline-none focus:ring-8 focus:ring-indigo-500/10 border-2 border-transparent focus:border-indigo-500/20 shadow-inner transition-all group-hover:bg-slate-200/50"
                />
                <button className="absolute right-6 top-1/2 -translate-y-1/2 p-4 text-indigo-600 hover:scale-125 transition-transform duration-300">
                  <Send className="w-8 h-8" />
                </button>
              </div>
            </div>
          </footer>
        )}
      </div>
    );
  };

  return currentSubject ? renderSubjectView() : renderHome();
};

export default App;
