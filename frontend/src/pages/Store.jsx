import React from 'react';
import { useTranslation } from 'react-i18next';

function Store() {
    const { t } = useTranslation();
    const bookStores = t('storePage.bookStores.list', { returnObjects: true });
    const uniformVendors = t('storePage.uniformVendors.list', { returnObjects: true });

    const safeBookStores = Array.isArray(bookStores) ? bookStores : [];
    const safeUniformVendors = Array.isArray(uniformVendors) ? uniformVendors : [];

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

            <div className="flex flex-col md:flex-row gap-8">

                {/* Book Stores */}
                <div className="bg-white shadow-xl rounded-2xl p-6 w-[400px]">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        {t('storePage.bookStores.title')}
                    </h1>

                    {safeBookStores.map((store, index) => (
                        <div key={store.name} className={index < safeBookStores.length - 1 ? 'mb-4 border-b pb-3' : ''}>
                            <h2 className="text-lg font-semibold text-blue-800">
                                {store.name}
                            </h2>
                            <p className="text-gray-600 text-sm">
                                {store.address}
                            </p>
                            <p className="text-gray-500 text-sm">
                                {t('storePage.phoneLabel')}: {store.phone}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Uniform Vendors */}
                <div className="bg-white shadow-xl rounded-2xl p-6 w-[400px]">
                    <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
                        {t('storePage.uniformVendors.title')}
                    </h1>

                    {safeUniformVendors.map((vendor, index) => (
                        <div key={vendor.name} className={index < safeUniformVendors.length - 1 ? 'mb-4 border-b pb-3' : ''}>
                            <h2 className="text-lg font-semibold text-blue-800">
                                {vendor.name}
                            </h2>
                            <p className="text-gray-600 text-sm">
                                {vendor.address}
                            </p>
                            <p className="text-gray-500 text-sm">
                                {t('storePage.phoneLabel')}: {vendor.phone}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default Store;
