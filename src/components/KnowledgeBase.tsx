import React, { useState, useEffect } from 'react';
import { UploadCloud, FileText, Trash2, Search, CheckCircle2, AlertCircle, Loader2, File, Database } from 'lucide-react';

interface KnowledgeItem {
    id: string;
    name: string;
    type: string;
    size: string;
    status: 'indexed' | 'indexing' | 'error';
    date: string;
    content?: string; // Added content field
}

const KnowledgeBase = () => {
    const [items, setItems] = useState<KnowledgeItem[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Load items from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('prism_knowledge_base');
        // ... (rest of code)
        if (saved) {
            setItems(JSON.parse(saved));
        } else {
            // Mock initial data
            setItems([
                { id: '1', name: 'Product_Requirements_v2.pdf', type: 'PDF', size: '2.4 MB', status: 'indexed', date: '2024-02-08', content: "Mock content for product requirements..." },
                { id: '2', name: 'Q4_Financial_Report.csv', type: 'CSV', size: '1.1 MB', status: 'indexed', date: '2024-02-07', content: "Mock content for financial report..." },
            ]);
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('prism_knowledge_base', JSON.stringify(items));
    }, [items]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    };

    const extractTextFromPDF = async (file: File): Promise<string> => {
        try {
            // Dynamic import to avoid SSR issues with canvas
            const pdfjsLib = await import('pdfjs-dist');
            pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = '';

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const pageText = textContent.items.map((item: any) => item.str || '').join(' ');
                fullText += pageText + '\n';
            }
            return fullText;
        } catch (error) {
            console.error("Error parsing PDF:", error);
            return "";
        }
    };

    const handleFiles = async (files: File[]) => {
        const newItems: KnowledgeItem[] = files.map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
            size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
            status: 'indexing',
            date: new Date().toISOString().split('T')[0],
            content: ''
        }));

        setItems(prev => [...newItems, ...prev]);

        // Process files
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const item = newItems[i];

            let extractedText = '';

            // Extract text based on type
            if (file.type === 'application/pdf') {
                extractedText = await extractTextFromPDF(file);
            } else if (file.type === 'text/plain' || file.name.endsWith('.md') || file.name.endsWith('.csv')) {
                extractedText = await file.text();
            }

            // Simulate indexing delay but update with real content
            setTimeout(() => {
                setItems(prev => prev.map(it => it.id === item.id ? {
                    ...it,
                    status: extractedText ? 'indexed' : 'error',
                    content: extractedText.slice(0, 5000) // Truncate to save localStorage space
                } : it));
            }, 1500);
        }
    };

    const handleDelete = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex-1 p-8 overflow-y-auto w-full max-w-7xl mx-auto">
            {/* Header Stats */}
            <div className="mb-10">
                <h1 className="text-3xl font-black mb-2">Knowledge Base</h1>
                <p className="text-gray-500 mb-8">Manage the documents and data sources Prizm AI uses for context.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-2xl">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><FileText className="w-6 h-6" /></div>
                            <div>
                                <p className="text-2xl font-bold text-white">{items.length}</p>
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Files</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-2xl">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-green-500/10 rounded-xl text-green-400"><Database className="w-6 h-6" /></div>
                            <div>
                                <p className="text-2xl font-bold text-white">
                                    {items.filter(i => i.status === 'indexed').length}
                                </p>
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Active Indexes</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#0f0f0f] border border-white/5 p-6 rounded-2xl">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400"><UploadCloud className="w-6 h-6" /></div>
                            <div>
                                <p className="text-2xl font-bold text-white">
                                    {items.reduce((acc, curr) => acc + parseFloat(curr.size), 0).toFixed(1)} MB
                                </p>
                                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Storage Used</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upload Zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`mb-10 border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-300 ${isDragging
                    ? 'border-primary bg-primary/5 scale-[1.01]'
                    : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
            >
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <UploadCloud className={`w-8 h-8 ${isDragging ? 'text-primary' : 'text-gray-400'}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Drop files here to upload</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Support for PDF, CSV, TXT, and MD files. Files are automatically indexed for search.
                </p>
                <label className="cursor-pointer bg-white text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">
                    Browse Files
                    <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                    />
                </label>
            </div>

            {/* File List */}
            <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/5 flex items-center justify-between gap-4">
                    <h3 className="font-bold text-lg pl-2">Documents</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search files..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-black/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-white/30 w-64"
                        />
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Size</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredItems.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                                    No documents found
                                </td>
                            </tr>
                        ) : (
                            filteredItems.map((item) => (
                                <tr key={item.id} className="group hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/5 rounded-lg">
                                                <File className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <span className="font-medium text-white">{item.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-bold border ${item.status === 'indexed'
                                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                            : item.status === 'indexing'
                                                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                                            }`}>
                                            {item.status === 'indexed' && <CheckCircle2 className="w-3 h-3" />}
                                            {item.status === 'indexing' && <Loader2 className="w-3 h-3 animate-spin" />}
                                            {item.status === 'error' && <AlertCircle className="w-3 h-3" />}
                                            <span className="capitalize">{item.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm font-mono">{item.size}</td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">{item.date}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            title="Delete File"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default KnowledgeBase;
