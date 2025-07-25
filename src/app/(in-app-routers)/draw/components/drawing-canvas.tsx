'use client';
/* eslint-disable react-hooks/exhaustive-deps */
import type React from 'react';
import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Eraser, Undo, Download, Trash2, Circle, Square, Pencil, Save } from 'lucide-react';
import { toast } from 'sonner';

type DrawingTool = 'pencil' | 'eraser' | 'circle' | 'square';

// Removed content and onChange from props
export function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const [tool, setTool] = useState<DrawingTool>('pencil');
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // Internal state for drawing content
  const [drawingContent, setDrawingContent] = useState<string>('');

  // Drawing history for undo functionality
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Save current canvas state to history and update internal drawingContent
  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL();

    setHistory((prevHistory) => {
      // If we're not at the end of the history, remove future states
      const newHistory = prevHistory.slice(0, historyIndex + 1);
      return [...newHistory, dataURL];
    });
    setHistoryIndex((prevIndex) => prevIndex + 1);
    setDrawingContent(dataURL); // Update internal content state
  };

  // Initialize canvas and load content if available
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match parent container
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
      // Redraw content after resize to prevent loss
      if (history[historyIndex]) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = history[historyIndex];
      } else if (drawingContent) {
        // If history is empty but initial content exists, load it
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          // After loading, save to history if it's the first load
          if (history.length === 0) {
            saveToHistory();
          }
        };
        img.src = drawingContent;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Load existing drawing if available and history is empty
    if (drawingContent && history.length === 0) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        saveToHistory(); // Save initial content to history
      };
      img.src = drawingContent;
    } else if (!drawingContent && history.length === 0) {
      // Initialize history with blank canvas if no content and history is empty
      saveToHistory();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []); // Empty dependency array to run only once on mount

  // Effect to update canvas when historyIndex changes (for undo/redo)
  useEffect(() => {
    if (historyIndex >= 0 && history[historyIndex] !== undefined) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        setDrawingContent(history[historyIndex]); // Update internal content state on undo/redo
      };
      img.src = history[historyIndex];
    }
  }, [historyIndex]); // Depend on historyIndex

  // Undo last action
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  };

  // Clear canvas
  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  // Download canvas as image
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = dataURL;
    link.click();
  };

  // Drawing event handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    setIsDrawing(true);

    // Get mouse/touch position
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    setStartPos({ x, y }); // Set startPos for all tools

    if (tool === 'pencil' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
      ctx.lineWidth = lineWidth;
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Get mouse/touch position
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (tool === 'pencil' || tool === 'eraser') {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'circle' || tool === 'square') {
      // For shape tools, we'll preview the shape by redrawing
      // We need to save the current canvas state first
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      // Draw the last saved history state onto the temporary canvas
      const lastHistoryState = history[historyIndex];
      if (lastHistoryState) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          tempCtx.drawImage(img, 0, 0);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(tempCanvas, 0, 0); // Draw the base image
          drawShapePreview(ctx, x, y); // Draw the current shape preview
        };
        img.src = lastHistoryState;
      } else {
        // If no history, just clear and draw preview
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawShapePreview(ctx, x, y);
      }
    }
  };

  const drawShapePreview = (ctx: CanvasRenderingContext2D, currentX: number, currentY: number) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    if (tool === 'circle') {
      const radius = Math.sqrt(Math.pow(currentX - startPos.x, 2) + Math.pow(currentY - startPos.y, 2));
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
    } else if (tool === 'square') {
      const width = currentX - startPos.x;
      const height = currentY - startPos.y;
      ctx.rect(startPos.x, startPos.y, width, height);
    }
    ctx.stroke();
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    if (tool === 'pencil' || tool === 'eraser') {
      ctx.closePath();
      saveToHistory(); // Save for pencil/eraser after path is closed
    } else if (tool === 'circle' || tool === 'square') {
      // For shapes, draw the final shape onto the canvas
      let clientX, clientY;
      if ('changedTouches' in e) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Redraw the base image from history
      const lastHistoryState = history[historyIndex];
      if (lastHistoryState) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          drawFinalShape(ctx, x, y); // Draw the final shape
          saveToHistory();
        };
        img.src = lastHistoryState;
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawFinalShape(ctx, x, y);
        saveToHistory();
      }
    }
  };

  const drawFinalShape = (ctx: CanvasRenderingContext2D, finalX: number, finalY: number) => {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    if (tool === 'circle') {
      const radius = Math.sqrt(Math.pow(finalX - startPos.x, 2) + Math.pow(finalY - startPos.y, 2));
      ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
    } else if (tool === 'square') {
      const width = finalX - startPos.x;
      const height = finalY - startPos.y;
      ctx.rect(startPos.x, startPos.y, width, height);
    }
    ctx.stroke();
  };

  useEffect(() => {
    toast.info('Tính năng này đang được phát triển', {
      duration: 10000,
      position: 'bottom-right',
      style: {
        backgroundColor: '#f8f9fa',
        color: '#343a40',
        border: '1px solid #ced4da',
      },
    });
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 py-2 px-4 border-b">
        <div className="flex gap-1">
          <Button variant={tool === 'pencil' ? 'default' : 'ghost'} size="icon" onClick={() => setTool('pencil')}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant={tool === 'eraser' ? 'default' : 'ghost'} size="icon" onClick={() => setTool('eraser')}>
            <Eraser className="w-4 h-4" />
          </Button>
          <Button variant={tool === 'circle' ? 'default' : 'ghost'} size="icon" onClick={() => setTool('circle')}>
            <Circle className="w-4 h-4" />
          </Button>
          <Button variant={tool === 'square' ? 'default' : 'ghost'} size="icon" onClick={() => setTool('square')}>
            <Square className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 p-0 border rounded cursor-pointer"
          />
          <div className="flex items-center gap-2 w-32">
            <span className="text-xs">Size:</span>
            <Slider value={[lineWidth]} min={1} max={20} step={1} onValueChange={(value) => setLineWidth(value[0])} />
          </div>
        </div>
        <div className="flex gap-1 ml-auto">
          <Button variant="ghost" size="icon" onClick={handleUndo} disabled={historyIndex <= 0}>
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleClear}>
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleDownload}>
            <Download className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              toast.info('Tính năng này đang được phát triển', {
                position: 'top-right',
              });
            }}
          >
            <Save className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 relative bg-white">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
    </div>
  );
}
