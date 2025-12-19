
import React, { useEffect, useRef, useState } from 'react';
import { BrainCircuit, ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';

interface MermaidChartProps {
  chart: string;
}

const MermaidChart: React.FC<MermaidChartProps> = ({ chart }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomScale, setZoomScale] = useState(1);

  useEffect(() => {
    if (chartRef.current && chart) {
      // @ts-ignore
      if (window.mermaid) {
        // Clear previous content
        chartRef.current.innerHTML = '';
        
        // Ensure chart is wrapped in a mindmap syntax if not already
        let formattedChart = chart.trim();
        if (!formattedChart.toLowerCase().startsWith('mindmap')) {
           formattedChart = `mindmap\n  root((Kết quả))\n    ${formattedChart}`;
        }

        const renderDiv = document.createElement('div');
        renderDiv.className = 'mermaid flex justify-center items-center';
        renderDiv.innerHTML = formattedChart;
        chartRef.current.appendChild(renderDiv);
        
        // @ts-ignore
        window.mermaid.contentLoaded();
      }
    }
  }, [chart]);

  const handleZoomIn = () => setZoomScale(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoomScale(prev => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => setZoomScale(1);

  return (
    <div className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] border border-slate-200 shadow-xl mt-12 animate-in fade-in slide-in-from-bottom-6 duration-700 overflow-hidden">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 border-b-2 border-slate-50 pb-6 gap-4">
        <h3 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-4">
          <span className="w-3 h-10 bg-indigo-600 rounded-full shadow-lg shadow-indigo-200"></span>
          Sơ đồ tư duy
        </h3>
        
        {/* Zoom Controls */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl shadow-inner border border-slate-200">
          <button 
            onClick={handleZoomOut}
            className="p-2 hover:bg-white hover:text-indigo-600 rounded-xl transition-all text-slate-500 hover:shadow-md active:scale-90"
            title="Thu nhỏ"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <div className="w-[1px] h-6 bg-slate-300 mx-1"></div>
          <button 
            onClick={handleResetZoom}
            className="px-3 py-1.5 hover:bg-white hover:text-indigo-600 rounded-xl transition-all text-slate-600 text-xs font-bold flex items-center gap-1 hover:shadow-md active:scale-95"
            title="Đặt lại"
          >
            <RotateCcw className="w-4 h-4" />
            {Math.round(zoomScale * 100)}%
          </button>
          <div className="w-[1px] h-6 bg-slate-300 mx-1"></div>
          <button 
            onClick={handleZoomIn}
            className="p-2 hover:bg-white hover:text-indigo-600 rounded-xl transition-all text-slate-500 hover:shadow-md active:scale-90"
            title="Phóng to"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>

        <div className="hidden sm:block p-2 bg-indigo-50 rounded-xl">
           <BrainCircuit className="w-6 h-6 text-indigo-600" />
        </div>
      </div>

      {/* Mindmap Viewport */}
      <div 
        ref={containerRef}
        className="mermaid-viewport relative w-full h-[400px] md:h-[600px] overflow-auto rounded-3xl bg-slate-50/50 border border-slate-100 cursor-grab active:cursor-grabbing no-scrollbar"
      >
        <div 
          className="mermaid-content-wrapper transition-transform duration-300 ease-out origin-center min-w-full min-h-full flex items-center justify-center p-12"
          style={{ transform: `scale(${zoomScale})` }}
          ref={chartRef}
        >
          {/* Mermaid SVG will be rendered here */}
        </div>
      </div>

      <div className="mt-8 text-center flex flex-col gap-2">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Hệ thống hóa kiến thức trực quan • Symbiotic AI</p>
      </div>
    </div>
  );
};

export default MermaidChart;
