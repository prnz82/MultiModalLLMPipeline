import React, { useCallback, useState } from 'react';
import { Upload, FileAudio, FileImage, X, Search } from 'lucide-react';

const FileUpload = ({ file, setFile }) => {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        validateAndSetFile(droppedFile);
    }, [setFile]);

    const validateAndSetFile = (file) => {
        if (!file) return;
        const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'audio/mpeg', 'audio/wav', 'audio/mp3'];
        if (!validTypes.includes(file.type)) {
            alert('Unsupported format. Please stick to standard Image or Audio files.');
            return;
        }
        setFile(file);
    };

    const clearFile = (e) => {
        e.stopPropagation();
        setFile(null);
    };

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-4">
                <Search className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Input Source</h3>
            </div>

            <label
                className={`
          relative flex flex-col items-center justify-center w-full h-48 
          rounded-xl cursor-pointer transition-all duration-300
          border-2 border-dashed
          ${isDragOver
                        ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
                        : file
                            ? 'border-emerald-500/50 bg-emerald-500/5'
                            : 'border-slate-700 bg-slate-800/30 hover:border-slate-500 hover:bg-slate-800/80'}
        `}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
            >
                {file ? (
                    <div className="flex flex-col items-center animate-enter">
                        <div className={`
                p-4 rounded-full mb-3 shadow-lg
                ${file.type.startsWith('image/') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-purple-500/20 text-purple-400'}
              `}>
                            {file.type.startsWith('image/') ? <FileImage className="w-8 h-8" /> : <FileAudio className="w-8 h-8" />}
                        </div>
                        <p className="text-slate-200 font-medium font-sans">{file.name}</p>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">
                            {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type.split('/')[1].toUpperCase()}
                        </p>

                        <button
                            onClick={clearFile}
                            className="absolute top-3 right-3 p-2 rounded-full hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="text-center p-6 pointer-events-none">
                        <div className="w-12 h-12 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Upload className="w-6 h-6 text-indigo-400" />
                        </div>
                        <p className="text-slate-300 font-medium">Click or drag file here</p>
                        <p className="text-xs text-slate-500 mt-2 max-w-[200px] mx-auto leading-relaxed">
                            Supports JPG, PNG, WEBP, MP3, WAV
                        </p>
                    </div>
                )}

                <input
                    type="file"
                    className="hidden"
                    accept="image/*,audio/*"
                    onChange={(e) => validateAndSetFile(e.target.files[0])}
                    disabled={!!file}
                />
            </label>
        </div>
    );
};

export default FileUpload;
