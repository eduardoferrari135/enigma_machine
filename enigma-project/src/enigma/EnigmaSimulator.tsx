import React, { useState, useEffect, useCallback } from 'react';
import { Settings, X, RotateCcw } from 'lucide-react';
import { EnigmaMachine, EnigmaFactory, MachineLibrary, Alphabet } from './enigma-core'
import './EnigmaSimulator.css';

const EnigmaSimulator: React.FC = () => {
  // --- Estado ---
  const [enigma, setEnigma] = useState<EnigmaMachine | null>(null);
  
  // Estado Visual
  const [rotorPos, setRotorPos] = useState<string[]>(['A', 'A', 'A']);
  const [litLamp, setLitLamp] = useState<string | null>(null);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [outputTape, setOutputTape] = useState("");
  const [inputTape, setInputTape] = useState("");
  
  // Configurações
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState({
    rotors: ['I', 'II', 'III'], 
    rings: [0, 0, 0],           
    positions: [0, 0, 0],       
    reflector: 'B',
    plugs: [] as string[]
  });

  const [selectedPlug, setSelectedPlug] = useState<string | null>(null);

  // --- FUNÇÃO DE RESET/INICIALIZAÇÃO ---
  const resetMachine = useCallback(() => {
    const machine = EnigmaFactory.createMachine(config);
    setEnigma(machine);
    setRotorPos(machine.getDisplayPositions());
    setOutputTape("");
    setInputTape(""); 
  }, [config]);

  useEffect(() => {
    resetMachine();
  }, [resetMachine]);

  // Handlers
  const handleKeyDown = useCallback((char: string) => {
    if (!enigma) return;
    
    const cipher = enigma.encipher(char);
    
    setLitLamp(cipher);
    setPressedKey(char);
    setRotorPos(enigma.getDisplayPositions());
    
    setOutputTape(prev => (prev + cipher).slice(-35));
    setInputTape(prev => (prev + char).slice(-35));
  }, [enigma]);

  const handleKeyUp = useCallback(() => {
    setLitLamp(null);
    setPressedKey(null);
  }, []);

  useEffect(() => {
    const kd = (e: KeyboardEvent) => {
      const k = e.key.toUpperCase();
      if (Alphabet.contains(k) && !e.repeat && !e.ctrlKey && !e.metaKey) {
        handleKeyDown(k);
      }
    };
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
        window.removeEventListener('keydown', kd);
        window.removeEventListener('keyup', handleKeyUp);
    }
  }, [handleKeyDown, handleKeyUp]);

  // Lógica do Plugboard (UI)
  const handlePlugClick = (char: string) => {
    if (selectedPlug === char) {
      setSelectedPlug(null);
      return;
    }
    if (selectedPlug) {
      const cleanPlugs = config.plugs.filter(p => !p.includes(selectedPlug) && !p.includes(char));
      setConfig(prev => ({ ...prev, plugs: [...cleanPlugs, selectedPlug + char] }));
      setSelectedPlug(null);
    } else {
      const existing = config.plugs.find(p => p.includes(char));
      if (existing) {
        setConfig(prev => ({ ...prev, plugs: prev.plugs.filter(p => p !== existing) }));
      } else {
        setSelectedPlug(char);
      }
    }
  };

  const getPlugColor = (char: string) => {
    const idx = config.plugs.findIndex(p => p.includes(char));
    if (idx === -1) return null;
    const colors = ['#ef5350', '#42a5f5', '#66bb6a', '#ffa726', '#ab47bc', '#26c6da', '#ff7043', '#8d6e63'];
    return colors[idx % colors.length];
  };

  const updateConfig = (key: 'rotors' | 'rings' | 'positions', idx: number, val: any) => {
      const newArr = [...config[key]];
      newArr[idx] = val;
      setConfig({ ...config, [key]: newArr });
  };

  const rows = ["QWERTZUIO", "ASDFGHJK", "PYXCVBNML"];
  const alphabetList = Alphabet.list;

  return (
    <div className="enigma-wrapper">
      {/* --- SETTINGS MODAL --- */}
      {showSettings && (
        <div className="settings-overlay">
            <div className="settings-box">
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
                    <h3 style={{margin:0}}>Machine Config</h3>
                    <button onClick={() => setShowSettings(false)} style={{background:'none', border:'none', color:'#fff', cursor:'pointer'}}><X size={20}/></button>
                </div>
                
                <div className="st-grid">
                    <div></div>
                    <div className="st-grid-header">Ring (A-Z)</div>
                    <div className="st-grid-header">Start (A-Z)</div>

                    {[0, 1, 2].map((idx) => (
                        <React.Fragment key={idx}>
                            <div style={{marginBottom:'5px'}}>
                                <label className="st-label" style={{marginBottom:0}}>
                                    {idx===0 ? 'Left (Slow)' : idx===1 ? 'Middle' : 'Right (Fast)'}
                                </label>
                                <select className="st-select" value={config.rotors[idx]} onChange={e => updateConfig('rotors', idx, e.target.value)}>
                                    {MachineLibrary.availableRotors.map(k => <option key={k} value={k}>{k}</option>)}
                                </select>
                            </div>
                            <select className="st-select" value={Alphabet.toChar(config.rings[idx])} onChange={e => updateConfig('rings', idx, Alphabet.toInt(e.target.value))}>
                                {alphabetList.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <select className="st-select" value={Alphabet.toChar(config.positions[idx])} onChange={e => updateConfig('positions', idx, Alphabet.toInt(e.target.value))}>
                                {alphabetList.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </React.Fragment>
                    ))}
                </div>

                <div className="st-row">
                    <label className="st-label">Reflector</label>
                    <select className="st-select" value={config.reflector} onChange={e => setConfig({...config, reflector: e.target.value})}>
                         {MachineLibrary.availableReflectors.map(k => <option key={k} value={k}>Reflector {k}</option>)}
                    </select>
                </div>
                <button onClick={() => setShowSettings(false)} style={{width:'100%', padding:'10px', background:'#2e7d32', color:'#fff', border:'none', borderRadius:'4px', cursor:'pointer', fontWeight:'bold'}}>
                    APPLY CHANGES
                </button>
            </div>
        </div>
      )}

      {/* --- MAQUINA --- */}
      <div className="wood-case">
        <div className="metal-plate">
          
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div style={{color: '#888', fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase'}}>
                Enigma Simulator
              </div>
              <div style={{display:'flex', gap:'8px'}}>
                <button onClick={resetMachine} title="Reset Machine" style={{background:'none', border:'none', color:'#aaa', cursor:'pointer'}}>
                    <RotateCcw size={16}/>
                </button>
                <button 
                    onClick={() => setShowSettings(true)}
                    title="Open Configuration"
                    style={{background:'transparent', border:'none', color:'#aaa', cursor:'pointer', display:'flex', alignItems:'center', gap:'5px'}}
                >
                    <Settings size={18} /> <span style={{fontSize:'0.8rem'}}>CONFIG</span>
                </button>
              </div>
          </div>

          {/* ROTOR WINDOWS */}
          <div className="rotors-container">
            {rotorPos.map((char, i) => (
              <div key={i} className="rotor-window">{char}</div>
            ))}
          </div>

          {/* LAMPBOARD */}
          <div className="lampboard">
            {rows.map((row, i) => (
              <div key={i} className="row-flex">
                {row.split('').map(char => (
                  <div key={char} className={`lamp ${litLamp === char ? 'active' : ''}`}>
                    {char}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{height: '1px', background: '#444', margin: '5px 0'}}></div>

          {/* KEYBOARD */}
          <div className="keyboard">
            {rows.map((row, i) => (
              <div key={i} className="row-flex">
                {row.split('').map(char => (
                  <div 
                    key={char} 
                    className={`key-btn ${pressedKey === char ? 'pressed' : ''}`}
                    onMouseDown={() => handleKeyDown(char)}
                    onMouseUp={handleKeyUp}
                    onMouseLeave={handleKeyUp}
                  >
                    {char}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* PLUGBOARD */}
          <div className="plugboard-area">
             <div style={{width:'100%', fontSize:'0.7rem', color:'#666', borderBottom:'1px solid #333', paddingBottom:'5px', marginBottom:'5px', textAlign:'center'}}>
                 STECKERBRETT (PLUGBOARD)
             </div>
             {rows.map((row, i) => (
                <div key={i} className="row-flex">
                    {row.split('').map(char => {
                        const color = getPlugColor(char);
                        const isSelected = selectedPlug === char;
                        return (
                            <div key={char} className="socket-unit">
                                <div 
                                    className="socket-hole"
                                    onClick={() => handlePlugClick(char)}
                                    style={{
                                        borderColor: isSelected ? '#fff' : color ? color : '#555',
                                        backgroundColor: color ? color : '#000',
                                        boxShadow: isSelected ? '0 0 8px #fff' : color ? `0 0 10px ${color}` : 'none'
                                    }}
                                ></div>
                                <span style={{fontSize:'10px', color:'#555'}}>{char}</span>
                            </div>
                        )
                    })}
                </div>
             ))}
             <div style={{fontSize:'0.65rem', color:'#444'}}>Click two letters to connect cables</div>
          </div>

          {/* OUTPUT TAPES */}
          <div style={{display:'flex', flexDirection:'column', gap:'5px', marginTop:'10px'}}>
              <div className="tape-output" style={{marginTop:0, color:'#555', background:'#d0d0d0'}}>
                 {inputTape || "PLAIN TEXT"}
              </div>
              <div className="tape-output" style={{marginTop:0, fontWeight:'bold'}}>
                 {outputTape || "CIPHER TEXT"}
              </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EnigmaSimulator;