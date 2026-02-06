'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPinIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

declare global {
    interface Window {
        google: any;
        initGoogleMaps: () => void;
    }
}

interface AddressData {
    full_address: string;
    street: string;
    city: string;
    province: string;
    postal_code: string;
    lat: number;
    lng: number;
}

interface AddressFormProps {
    onAddressSelect: (address: AddressData) => void;
    onCancel?: () => void;
    initialAddress?: AddressData | null;
    showMap?: boolean;
}

export default function AddressForm({ onAddressSelect, onCancel, initialAddress, showMap = true }: AddressFormProps) {
    const [address, setAddress] = useState<AddressData>({
        full_address: initialAddress?.full_address || '',
        street: initialAddress?.street || '',
        city: initialAddress?.city || '',
        province: initialAddress?.province || 'Gauteng',
        postal_code: initialAddress?.postal_code || '',
        lat: initialAddress?.lat || -26.2041,
        lng: initialAddress?.lng || 28.0473,
    });
    const [error, setError] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const autocompleteRef = useRef<any>(null);

    // Load Google Maps script
    useEffect(() => {
        if (typeof window !== 'undefined' && !window.google) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&libraries=places&callback=initGoogleMaps`;
            script.async = true;
            script.defer = true;

            window.initGoogleMaps = () => {
                setIsLoaded(true);
            };

            document.head.appendChild(script);
        } else if (window.google) {
            setIsLoaded(true);
        }
    }, []);

    // Initialize map and autocomplete
    useEffect(() => {
        if (!isLoaded || !window.google) return;

        // Initialize Map
        if (showMap && mapRef.current && !mapInstanceRef.current) {
            mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
                center: { lat: address.lat, lng: address.lng },
                zoom: 12,
                styles: [
                    { elementType: 'geometry', stylers: [{ color: '#1a1a1a' }] },
                    { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a1a' }] },
                    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
                    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2c2c2c' }] },
                    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
                ],
            });

            markerRef.current = new window.google.maps.Marker({
                position: { lat: address.lat, lng: address.lng },
                map: mapInstanceRef.current,
                draggable: true,
            });

            // Allow marker drag to update address
            markerRef.current.addListener('dragend', () => {
                const pos = markerRef.current.getPosition();
                reverseGeocode(pos.lat(), pos.lng());
            });
        }

        // Initialize Autocomplete
        if (inputRef.current && !autocompleteRef.current) {
            autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
                componentRestrictions: { country: 'za' },
                fields: ['address_components', 'geometry', 'formatted_address'],
            });

            autocompleteRef.current.addListener('place_changed', () => {
                const place = autocompleteRef.current.getPlace();
                if (!place.geometry) return;

                const addressComponents = place.address_components || [];
                const newAddress: AddressData = {
                    full_address: place.formatted_address || '',
                    street: '',
                    city: '',
                    province: '',
                    postal_code: '',
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                };

                for (const component of addressComponents) {
                    const types = component.types;
                    if (types.includes('street_number') || types.includes('route')) {
                        newAddress.street += component.long_name + ' ';
                    }
                    if (types.includes('locality') || types.includes('sublocality')) {
                        newAddress.city = component.long_name;
                    }
                    if (types.includes('administrative_area_level_1')) {
                        newAddress.province = component.long_name;
                    }
                    if (types.includes('postal_code')) {
                        newAddress.postal_code = component.long_name;
                    }
                }

                newAddress.street = newAddress.street.trim();

                // Validate Gauteng
                if (newAddress.province !== 'Gauteng') {
                    setError('Sorry, we only deliver to Gauteng at this time.');
                    return;
                }

                setError('');
                setAddress(newAddress);

                // Update map
                if (mapInstanceRef.current && markerRef.current) {
                    mapInstanceRef.current.setCenter({ lat: newAddress.lat, lng: newAddress.lng });
                    mapInstanceRef.current.setZoom(15);
                    markerRef.current.setPosition({ lat: newAddress.lat, lng: newAddress.lng });
                }
            });
        }
    }, [isLoaded, showMap]);

    const reverseGeocode = useCallback(async (lat: number, lng: number) => {
        if (!window.google) return;

        const geocoder = new window.google.maps.Geocoder();
        const result = await geocoder.geocode({ location: { lat, lng } });

        if (result.results[0]) {
            const place = result.results[0];
            const addressComponents = place.address_components || [];
            const newAddress: AddressData = {
                full_address: place.formatted_address || '',
                street: '',
                city: '',
                province: '',
                postal_code: '',
                lat,
                lng,
            };

            for (const component of addressComponents) {
                const types = component.types;
                if (types.includes('street_number') || types.includes('route')) {
                    newAddress.street += component.long_name + ' ';
                }
                if (types.includes('locality') || types.includes('sublocality')) {
                    newAddress.city = component.long_name;
                }
                if (types.includes('administrative_area_level_1')) {
                    newAddress.province = component.long_name;
                }
                if (types.includes('postal_code')) {
                    newAddress.postal_code = component.long_name;
                }
            }

            newAddress.street = newAddress.street.trim();

            if (newAddress.province !== 'Gauteng') {
                setError('Sorry, we only deliver to Gauteng at this time.');
                return;
            }

            setError('');
            setAddress(newAddress);
        }
    }, []);

    const handleConfirm = () => {
        if (!address.full_address) {
            setError('Please select an address');
            return;
        }
        if (address.province !== 'Gauteng') {
            setError('Sorry, we only deliver to Gauteng at this time.');
            return;
        }
        onAddressSelect(address);
    };

    return (
        <div className="bg-[#121212] border border-[#27272a] rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center">
                <MapPinIcon className="h-5 w-5 text-[#4ADE80] mr-2" />
                Delivery Address
            </h3>

            {/* Search Input */}
            <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-gray-500 font-bold">
                    Search Address
                </label>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Start typing your address..."
                    defaultValue={address.full_address}
                    className="w-full bg-[#1a1a1a] border border-[#27272a] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-[#4ADE80] focus:outline-none transition-colors"
                />
                <p className="text-xs text-gray-500">
                    We currently only deliver to <span className="text-[#4ADE80] font-bold">Gauteng</span>
                </p>
            </div>

            {error && (
                <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                    {error}
                </div>
            )}

            {/* Map */}
            {showMap && (
                <div
                    ref={mapRef}
                    className="w-full h-64 rounded-xl border border-[#27272a] bg-[#1a1a1a]"
                    style={{ minHeight: '250px' }}
                >
                    {!isLoaded && (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                            Loading map...
                        </div>
                    )}
                </div>
            )}

            {/* Address Preview */}
            {address.full_address && !error && (
                <div className="p-4 bg-[#1a1a1a] border border-[#4ADE80]/30 rounded-xl">
                    <p className="text-sm text-gray-400 mb-1">Selected Address:</p>
                    <p className="text-white font-medium">{address.full_address}</p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span>City: {address.city}</span>
                        <span>Postal: {address.postal_code}</span>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-3 bg-[#27272a] text-white rounded-xl hover:bg-[#3f3f46] transition-colors flex items-center justify-center"
                    >
                        <XMarkIcon className="h-5 w-5 mr-1" />
                        Cancel
                    </button>
                )}
                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={!address.full_address || !!error}
                    className="flex-1 py-3 bg-[#4ADE80] text-black font-bold rounded-xl hover:bg-[#45c975] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                    <CheckCircleIcon className="h-5 w-5 mr-1" />
                    Confirm Address
                </button>
            </div>
        </div>
    );
}
