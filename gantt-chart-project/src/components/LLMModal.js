import React, { useEffect } from 'react';
import { parseMarkdownToHtml } from '../utils/markdownParser';

const LLMModal = ({
    showLLMModal, setShowLLMModal, selectedTaskForLLM, language,
    llmLoadingDetails, llmErrorDetails, llmDetails,
    llmLoadingBreakdown, llmErrorBreakdown, llmBreakdown,
    llmLoadingRisk, llmErrorRisk, llmRiskAssessment,
    llmLoadingResources, llmErrorResources, llmResourceSuggestions,
    activeLLMTab, setActiveLLMTab,
    generateTaskDetails, generateTaskBreakdown, generateTaskRiskAssessment, generateResourceSuggestions
}) => {
    // React Hooks should always be called unconditionally at the top level of the component.
    // The conditional logic for generating details should be inside the useEffect.
    useEffect(() => {
        // This effect ensures that when the modal opens, the details tab is active
        // and its content is generated. Other tabs are generated on click.
        if (showLLMModal && selectedTaskForLLM && activeLLMTab === 'details' && !llmDetails && !llmLoadingDetails && !llmErrorDetails) {
            generateTaskDetails(selectedTaskForLLM);
        }
    }, [showLLMModal, selectedTaskForLLM, activeLLMTab, llmDetails, llmLoadingDetails, llmErrorDetails, generateTaskDetails]);

    // Early return statement should come after all hook calls
    if (!showLLMModal || !selectedTaskForLLM) return null;

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto font-vazirmatn relative">
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {language === 'fa' ? 'جزئیات تسک هوش مصنوعی' : 'AI Task Details'}
                    </h2>
                    <button
                        onClick={() => setShowLLMModal(false)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm"
                    >
                        {language === 'fa' ? 'بستن' : 'Close'}
                    </button>
                </div>

                <div className="flex mb-4 space-x-2 rtl:space-x-reverse overflow-x-auto pb-2">
                    <button
                        onClick={() => setActiveLLMTab('details')}
                        className={`flex-shrink-0 py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${activeLLMTab === 'details' ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                    >
                        {language === 'fa' ? '✨ جزئیات تسک' : '✨ Task Details'}
                    </button>
                    <button
                        onClick={() => {
                            setActiveLLMTab('breakdown');
                            if (!llmBreakdown && !llmLoadingBreakdown && !llmErrorBreakdown) {
                                generateTaskBreakdown(selectedTaskForLLM);
                            }
                        }}
                        className={`flex-shrink-0 py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${activeLLMTab === 'breakdown' ? 'bg-green-600 text-white shadow-md' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                    >
                        {language === 'fa' ? '✨ تقسیم تسک' : '✨ Break Down Task'}
                    </button>
                    <button
                        onClick={() => {
                            setActiveLLMTab('risk');
                            if (!llmRiskAssessment && !llmLoadingRisk && !llmErrorRisk) {
                                generateTaskRiskAssessment(selectedTaskForLLM);
                            }
                        }}
                        className={`flex-shrink-0 py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${activeLLMTab === 'risk' ? 'bg-purple-600 text-white shadow-md' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
                    >
                        {language === 'fa' ? '✨ ارزیابی ریسک' : '✨ Risk Assessment'}
                    </button>
                    <button
                        onClick={() => {
                            setActiveLLMTab('resources');
                            if (!llmResourceSuggestions && !llmLoadingResources && !llmErrorResources) {
                                generateResourceSuggestions(selectedTaskForLLM);
                            }
                        }}
                        className={`flex-shrink-0 py-2 px-4 rounded-lg font-medium transition-colors duration-200 ${activeLLMTab === 'resources' ? 'bg-yellow-600 text-white shadow-md' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
                    >
                        {language === 'fa' ? '✨ پیشنهاد منابع' : '✨ Resource Suggestions'}
                    </button>
                </div>

                {activeLLMTab === 'details' && (
                    <div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            {language === 'fa' ? 'تسک اصلی:' : 'Original Task:'} {language === 'fa' ? selectedTaskForLLM.fa : selectedTaskForLLM.en}
                        </h3>
                        {llmLoadingDetails ? (
                            <div className="flex justify-center items-center h-48">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                <p className="ml-4 text-gray-600">{language === 'fa' ? 'در حال تولید جزئیات...' : 'Generating details...'}</p>
                            </div>
                        ) : llmErrorDetails ? (
                            <div className="text-red-600 p-4 bg-red-50 rounded-md">
                                <p>{llmErrorDetails}</p>
                                <p className="mt-2">{language === 'fa' ? 'لطفاً دوباره تلاش کنید.' : 'Please try again.'}</p>
                            </div>
                        ) : (
                            <div className="prose max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(llmDetails) }}></div>
                        )}
                    </div>
                )}

                {activeLLMTab === 'breakdown' && (
                    <div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            {language === 'fa' ? 'تقسیم‌بندی تسک:' : 'Task Breakdown:'} {language === 'fa' ? selectedTaskForLLM.fa : selectedTaskForLLM.en}
                        </h3>
                        {llmLoadingBreakdown ? (
                            <div className="flex justify-center items-center h-48">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                                <p className="ml-4 text-gray-600">{language === 'fa' ? 'در حال تولید زیرتسک‌ها...' : 'Generating sub-tasks...'}</p>
                            </div>
                        ) : llmErrorBreakdown ? (
                            <div className="text-red-600 p-4 bg-red-50 rounded-md">
                                <p>{llmErrorBreakdown}</p>
                                <p className="mt-2">{language === 'fa' ? 'لطفاً دوباره تلاش کنید.' : 'Please try again.'}</p>
                            </div>
                        ) : (
                            <div className="prose max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(llmBreakdown) }}></div>
                        )}
                    </div>
                )}

                {activeLLMTab === 'risk' && (
                    <div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            {language === 'fa' ? 'ارزیابی ریسک برای تسک:' : 'Risk Assessment for Task:'} {language === 'fa' ? selectedTaskForLLM.fa : selectedTaskForLLM.en}
                        </h3>
                        {llmLoadingRisk ? (
                            <div className="flex justify-center items-center h-48">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                                <p className="ml-4 text-gray-600">{language === 'fa' ? 'در حال ارزیابی ریسک...' : 'Assessing risks...'}</p>
                            </div>
                        ) : llmErrorRisk ? (
                            <div className="text-red-600 p-4 bg-red-50 rounded-md">
                                <p>{llmErrorRisk}</p>
                                <p className="mt-2">{language === 'fa' ? 'لطفاً دوباره تلاش کنید.' : 'Please try again.'}</p>
                            </div>
                        ) : (
                            <div className="prose max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(llmRiskAssessment) }}></div>
                        )}
                    </div>
                )}

                {activeLLMTab === 'resources' && (
                    <div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            {language === 'fa' ? 'پیشنهاد منابع برای تسک:' : 'Resource Suggestions for Task:'} {language === 'fa' ? selectedTaskForLLM.fa : selectedTaskForLLM.en}
                        </h3>
                        {llmLoadingResources ? (
                            <div className="flex justify-center items-center h-48">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
                                <p className="ml-4 text-gray-600">{language === 'fa' ? 'در حال تولید پیشنهاد منابع...' : 'Generating resource suggestions...'}</p>
                            </div>
                        ) : llmErrorResources ? (
                            <div className="text-red-600 p-4 bg-red-50 rounded-md">
                                <p>{llmErrorResources}</p>
                                <p className="mt-2">{language === 'fa' ? 'لطفاً دوباره تلاش کنید.' : 'Please try again.'}</p>
                            </div>
                        ) : (
                            <div className="prose max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(llmResourceSuggestions) }}></div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LLMModal;
