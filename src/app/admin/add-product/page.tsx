// src/app/admin/add-product/page.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/auth-client";
import { PhotoIcon } from "@heroicons/react/24/outline";

export default function AddProductPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const supabaseClient = createClient();

    // Form State
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("Milling"); // Default
    const [stock, setStock] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);

    // CNC Specific Specs State
    const [cutDiameter, setCutDiameter] = useState("");
    const [shankDiameter, setShankDiameter] = useState("");
    const [flutes, setFlutes] = useState("4");
    const [coating, setCoating] = useState("TiAlN");
    const [overallLength, setOverallLength] = useState("");

    const handleUploadAndSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            let imageUrl = null;

            // 1. Upload Image if exists
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Date.now()}.${fileExt}`; // Unique name
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabaseClient
                    .storage
                    .from('products')
                    .upload(filePath, imageFile);

                if (uploadError) throw uploadError;

                // Get Public URL
                const { data: { publicUrl } } = supabaseClient
                    .storage
                    .from('products')
                    .getPublicUrl(filePath);

                imageUrl = publicUrl;
            }

            // 2. Prepare Specifications JSON
            const specs = {
                cut_diameter: cutDiameter,
                shank_diameter: shankDiameter,
                flutes: flutes,
                coating: coating,
                overall_length: overallLength
            };

            // 3. Insert into Database
            const { error: insertError } = await supabaseClient
                .from('products')
                .insert({
                    name,
                    description,
                    price: parseFloat(price),
                    category,
                    stock_quantity: parseInt(stock),
                    image_url: imageUrl,
                    specifications: specs // Saves as JSONB
                });

            if (insertError) throw insertError;

            setMessage("✅ Product added successfully!");
            // Reset form (optional)
            setName("");
            setPrice("");
            setImageFile(null);

        } catch (error: any) {
            console.error(error);
            setMessage(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-10">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-[#131921]">Admin: Add New Inventory</h1>

                {message && (
                    <div className={`p-4 mb-4 rounded ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleUploadAndSave} className="space-y-6">

                    {/* Section 1: Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Product Name</label>
                            <input
                                required type="text"
                                className="w-full border p-2 rounded mt-1"
                                placeholder="e.g. Solid Carbide End Mill"
                                value={name} onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Category</label>
                            <select
                                className="w-full border p-2 rounded mt-1"
                                value={category} onChange={(e) => setCategory(e.target.value)}
                            >
                                <option>Milling</option>
                                <option>Turning</option>
                                <option>Drilling</option>
                                <option>Inserts</option>
                                <option>Holders</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700">Description</label>
                        <textarea
                            required className="w-full border p-2 rounded mt-1" rows={3}
                            placeholder="Technical details about the tool..."
                            value={description} onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Price (ZAR)</label>
                            <input
                                required type="number" step="0.01"
                                className="w-full border p-2 rounded mt-1"
                                value={price} onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">Stock Quantity</label>
                            <input
                                required type="number"
                                className="w-full border p-2 rounded mt-1"
                                value={stock} onChange={(e) => setStock(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Section 2: Technical Specs (JSON) */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="font-bold text-gray-800 mb-4">⚙️ CNC Specifications</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500">Cut Diameter</label>
                                <input type="text" className="w-full border p-1 rounded" placeholder="e.g. 10mm"
                                    value={cutDiameter} onChange={(e) => setCutDiameter(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500">Shank Diameter</label>
                                <input type="text" className="w-full border p-1 rounded" placeholder="e.g. 10mm"
                                    value={shankDiameter} onChange={(e) => setShankDiameter(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500">Overall Length</label>
                                <input type="text" className="w-full border p-1 rounded" placeholder="e.g. 75mm"
                                    value={overallLength} onChange={(e) => setOverallLength(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500">Flutes</label>
                                <select className="w-full border p-1 rounded" value={flutes} onChange={(e) => setFlutes(e.target.value)}>
                                    <option>1</option><option>2</option><option>3</option><option>4</option><option>6</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500">Coating</label>
                                <input type="text" className="w-full border p-1 rounded" placeholder="e.g. TiAlN"
                                    value={coating} onChange={(e) => setCoating(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Image Upload */}
                    <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer hover:bg-gray-50 transition">
                        <input
                            type="file" accept="image/*"
                            onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
                            className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-yellow-50 file:text-yellow-700
                  hover:file:bg-yellow-100"
                        />
                        <div className="mt-2 text-xs text-gray-400">
                            {imageFile ? `Selected: ${imageFile.name}` : "Upload Product Image"}
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className={`w-full py-3 rounded font-bold text-white transition-colors
                ${loading ? 'bg-gray-400' : 'bg-[#131921] hover:bg-[#232f3e]'}`}
                    >
                        {loading ? "Uploading..." : "Add Product to Inventory"}
                    </button>

                </form>
            </div>
        </div>
    );
}