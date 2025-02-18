import React, { useState, useEffect } from 'react';

const CostCalculator = () => {
  const [minutes, setMinutes] = useState(100);
  const [telephonyProvider, setTelephonyProvider] = useState('twilio');
  const [customTelephonyCost, setCustomTelephonyCost] = useState(0);
  const [voiceProvider, setVoiceProvider] = useState('elevenlabs');
  const [llmProvider, setLlmProvider] = useState('gpt4-mini');
  const [automation, setAutomation] = useState(0);
  const [crm, setCrm] = useState(0);
  const [profit, setProfit] = useState(30);
  const [totalCost, setTotalCost] = useState(0);
  const [extraCosts, setExtraCosts] = useState([]);

  // Costos base por proveedor (USD)
  const costs = {
    telephony: {
      twilio: 0.010,
      custom: customTelephonyCost
    },
    voice: {
      elevenlabs: 0.07,
      playht: 0.010,
      openai: 0.010
    },
    llm: {
      'Custom': 0.000,
      'gpt4-mini': 0.006,
      'gpt4': 0.050,
      'claude-haiku': 0.012,
      'claude-sonnet': 0.060
    }
  };

  const calculateTotal = () => {
    const telephonyCost = minutes * (telephonyProvider === 'custom' ? customTelephonyCost : costs.telephony[telephonyProvider]);
    const voiceCost = minutes * costs.voice[voiceProvider];
    const llmCost = minutes * costs.llm[llmProvider];
    const extraCostsTotal = extraCosts.reduce((sum, cost) => {
      const amount = Number(cost.amount);
      return sum + (cost.type === 'perMinute' ? amount * minutes : amount);
    }, 0);
    
    const subtotal = telephonyCost + voiceCost + llmCost + Number(automation) + Number(crm) + extraCostsTotal;
    const profitAmount = subtotal * (profit / 100);
    const total = subtotal + profitAmount;
    
    setTotalCost(total);
  };

  useEffect(() => {
    calculateTotal();
  }, [minutes, telephonyProvider, customTelephonyCost, voiceProvider, llmProvider, automation, crm, profit, extraCosts]);

  const addExtraCost = () => {
    setExtraCosts([...extraCosts, { description: '', amount: 0, type: 'fixed' }]);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Retell AI
          </h1>
          <p className="text-xl text-white/90">
            Calculadora de Costos
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Minutos */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">Minutos</label>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setMinutes(prev => Math.max(0, prev - 100))}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  -
                </button>
                <input
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(Math.max(0, Number(e.target.value)))}
                  className="w-24 px-3 py-2 border rounded-lg text-center shadow-sm"
                />
                <button 
                  onClick={() => setMinutes(prev => prev + 100)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  +
                </button>
              </div>
            </div>

            {/* Telefonía */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefonía</label>
              <select 
                value={telephonyProvider}
                onChange={(e) => setTelephonyProvider(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg shadow-sm"
              >
                <option value="twilio">Twilio (${costs.telephony.twilio}/min)</option>
                <option value="custom">Custom</option>
              </select>
              {telephonyProvider === 'custom' && (
                <input
                  type="number"
                  value={customTelephonyCost}
                  onChange={(e) => setCustomTelephonyCost(Number(e.target.value))}
                  placeholder="Costo por minuto"
                  className="w-full px-3 py-2 border rounded-lg mt-2 shadow-sm"
                />
              )}
            </div>

            {/* Voz */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">Voz</label>
              <select 
                value={voiceProvider}
                onChange={(e) => setVoiceProvider(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg shadow-sm"
              >
                <option value="elevenlabs">ElevenLabs (${costs.voice.elevenlabs}/min)</option>
                <option value="playht">PlayHT (${costs.voice.playht}/min)</option>
                <option value="openai">OpenAI (${costs.voice.openai}/min)</option>
              </select>
            </div>

            {/* LLM */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">LLM</label>
              <select 
                value={llmProvider}
                onChange={(e) => setLlmProvider(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg shadow-sm"
              >
                <option value="Custom">Custom (${costs.llm.Custom})</option>
                <option value="gpt4-mini">GPT-4 mini (${costs.llm['gpt4-mini']})</option>
                <option value="gpt4">GPT-4 (${costs.llm.gpt4})</option>
                <option value="claude-haiku">Claude 3 Haiku (${costs.llm['claude-haiku']})</option>
                <option value="claude-sonnet">Claude 3.5 Sonnet (${costs.llm['claude-sonnet']})</option>
              </select>
            </div>

            {/* Automatización */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">Automatización (USD)</label>
              <input
                type="number"
                value={automation}
                onChange={(e) => setAutomation(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg shadow-sm"
              />
            </div>

            {/* CRM */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">CRM (USD)</label>
              <input
                type="number"
                value={crm}
                onChange={(e) => setCrm(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg shadow-sm"
              />
            </div>
          </div>

          {/* Costos Extra */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Costos Extra</h2>
              <button 
                onClick={addExtraCost}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Agregar Costo Extra
              </button>
            </div>
            {extraCosts.map((cost, index) => (
              <div key={index} className="flex space-x-3 mb-3 bg-gray-50 p-3 rounded-lg">
                <input
                  type="text"
                  placeholder="Descripción"
                  value={cost.description}
                  onChange={(e) => {
                    const newCosts = [...extraCosts];
                    newCosts[index].description = e.target.value;
                    setExtraCosts(newCosts);
                  }}
                  className="flex-1 px-3 py-2 border rounded-lg shadow-sm"
                />
                <input
                  type="number"
                  placeholder="Valor"
                  value={cost.amount}
                  onChange={(e) => {
                    const newCosts = [...extraCosts];
                    newCosts[index].amount = Number(e.target.value);
                    setExtraCosts(newCosts);
                  }}
                  className="w-32 px-3 py-2 border rounded-lg shadow-sm"
                />
                <select
                  value={cost.type}
                  onChange={(e) => {
                    const newCosts = [...extraCosts];
                    newCosts[index].type = e.target.value;
                    setExtraCosts(newCosts);
                  }}
                  className="w-40 px-3 py-2 border rounded-lg shadow-sm"
                >
                  <option value="fixed">Fijo</option>
                  <option value="perMinute">Por minuto</option>
                </select>
                <button
                  onClick={() => {
                    const newCosts = extraCosts.filter((_, i) => i !== index);
                    setExtraCosts(newCosts);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-md hover:from-red-600 hover:to-red-700 transition-all"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Ganancia */}
          <div className="mb-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
            <label className="block text-sm font-medium text-gray-700 mb-2">Ganancia (%)</label>
            <input
              type="range"
              min="0"
              max="100"
              value={profit}
              onChange={(e) => setProfit(Number(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-green-300 to-emerald-400 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm font-medium text-gray-600">{profit}%</span>
          </div>

          {/* Total */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-xl shadow-lg text-white">
            <h2 className="text-xl font-bold mb-2">Costo Total (tiene 3 decimales)</h2>
            <p className="text-4xl font-bold">
              ${totalCost.toFixed(3)} USD
            </p>
          </div>

          {/* Powered by */}
          <div className="mt-8 text-center text-gray-600">
            <p className="text-sm">
              Powered by{' '}
              <a 
                href="https://www.youtube.com/@Tincho.Olivero/videos" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                Tincho.Olivero
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostCalculator;