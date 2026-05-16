import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Plus, Trash2, Check, Shield, Sparkles } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const { updateUserProfile, awardPoints } = useAuthStore();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [occupation, setOccupation] = useState('');
  const [otherOccupation, setOtherOccupation] = useState('');
  const [mainGoals, setMainGoals] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState([{ name: '', phone: '', relation: 'Mother' }]);
  const [sosTrigger, setSosTrigger] = useState('Button');
  const [travelAtNight, setTravelAtNight] = useState('No');
  const [locationTracking, setLocationTracking] = useState('Allow (Recommended)');
  const [supportNeeded, setSupportNeeded] = useState('');
  const [stressFrequency, setStressFrequency] = useState('');
  const [wantMoodTracking, setWantMoodTracking] = useState('Yes');
  const [supportType, setSupportType] = useState('Chat-based support');
  const [skillsHave, setSkillsHave] = useState('');
  const [skillsWant, setSkillsWant] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [communityOptions, setCommunityOptions] = useState([]);
  const [enableNearbyAlerts, setEnableNearbyAlerts] = useState('Yes');
  const [scenarioPrefs, setScenarioPrefs] = useState([]);

  const toggleArrayItem = (setter, arr, item, max = null) => {
    if (arr.includes(item)) { setter(arr.filter(i => i !== item)); }
    else { if (max && arr.length >= max) { toast('Maximum selections reached', { icon: 'ℹ️' }); return; } setter([...arr, item]); }
  };
  const addContact = () => { if (emergencyContacts.length < 3) setEmergencyContacts([...emergencyContacts, { name: '', phone: '', relation: 'Friend' }]); };
  const updateContact = (i, f, v) => { const u = [...emergencyContacts]; u[i] = { ...u[i], [f]: v }; setEmergencyContacts(u); };
  const removeContact = (i) => setEmergencyContacts(emergencyContacts.filter((_, j) => j !== i));
  const requestLocation = () => { if (navigator.geolocation) navigator.geolocation.getCurrentPosition(() => toast.success('Location access granted!'), () => toast.error('Location access denied')); };

  const handleComplete = async () => {
    if (!fullName) { toast.error('Please go back to Step 1 and enter your Full Name'); return; }
    try {
      await updateUserProfile({
        name: fullName, age, phone, city,
        occupation: occupation === 'Other' ? otherOccupation : occupation,
        mainGoals, emergencyContacts: emergencyContacts.filter(c => c.name && c.phone),
        sosTrigger, travelAtNight, locationTracking, supportNeeded, stressFrequency,
        wantMoodTracking, supportType, skillsHave, skillsWant, lookingFor,
        communityOptions, enableNearbyAlerts, scenarioPrefs, onboardingComplete: true,
      });
      await awardPoints(60, "Completed Full Onboarding Verification");
      toast.success('Profile complete! You earned 60 ShePoints 🎉');
      navigate('/');
    } catch { toast.error('Failed to save profile'); }
  };

  // Styles matching RegisterPage ("Join Shakti")
  const inputStyle = {
    width: '100%', padding: '14px 18px',
    background: 'var(--color-surface-low)', border: '2px solid transparent',
    borderRadius: '14px', fontSize: '14px', fontFamily: 'var(--font-sans)',
    color: 'var(--color-shakti-dark-text)', outline: 'none',
    transition: 'border-color 0.2s, background 0.2s', boxSizing: 'border-box',
  };
  const labelStyle = {
    display: 'block', fontSize: '10px', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.12em',
    color: 'var(--color-outline)', marginBottom: '6px', marginLeft: '2px',
  };
  const focusIn = (e) => { e.target.style.borderColor = 'var(--color-shakti-primary)'; e.target.style.background = 'var(--color-surface-lowest)'; };
  const focusOut = (e) => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'var(--color-surface-low)'; };

  const OptionBtn = ({ label, selected, onClick }) => (
    <button onClick={onClick} type="button"
      style={{
        width: '100%', padding: '14px 18px', borderRadius: '14px',
        fontSize: '14px', fontWeight: 500, textAlign: 'left',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)',
        transition: 'all 0.2s',
        background: selected ? 'linear-gradient(135deg, #630ed4, #db2777)' : 'var(--color-surface-low)',
        color: selected ? 'white' : 'var(--color-shakti-dark-muted)',
        boxShadow: selected ? '0 6px 16px rgba(99,14,212,0.25)' : 'none',
      }}>
      <span>{label}</span>
      {selected && <Check size={16} />}
    </button>
  );

  const stepTitles = [
    { title: 'Personal Info', sub: "Let's set up your identity." },
    { title: 'Occupation & Goals', sub: 'Tell us what brings you here.' },
    { title: 'Safety Network', sub: 'Add your trusted guardians.' },
    { title: 'Wellness Support', sub: 'Mental health matters.' },
    { title: 'Career & Skills', sub: "Let's build your professional identity." },
    { title: 'Community Connect', sub: 'Empower yourself and others.' },
    { title: 'Smart Scenario', sub: 'How should SHAKTI protect you?' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px', background: 'var(--color-surface-base)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'fixed', top: '-10%', right: '-5%', width: '600px', height: '600px', borderRadius: '50%', filter: 'blur(120px)', pointerEvents: 'none', opacity: 0.15, background: 'radial-gradient(circle, rgba(99,14,212,0.4) 0%, transparent 70%)' }} />
      <div style={{ position: 'fixed', bottom: '-10%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none', opacity: 0.12, background: 'radial-gradient(circle, rgba(180,19,109,0.25) 0%, transparent 70%)' }} />

      <div style={{ width: '100%', maxWidth: '480px', zIndex: 10, display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        {/* Progress */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', padding: '0 8px' }}>
          {[1,2,3,4,5,6,7].map(s => (
            <div key={s} style={{ flex: 1, height: '6px', borderRadius: '999px', overflow: 'hidden', background: 'var(--color-surface-container)' }}>
              <motion.div style={{ height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #630ed4, #db2777)' }} initial={{ width: 0 }} animate={{ width: step >= s ? '100%' : '0%' }} transition={{ duration: 0.3 }} />
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--color-outline)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px' }}>Step {step} of 7 — Profile Setup</p>

        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{ background: 'var(--color-surface-lowest)', padding: '36px 28px', borderRadius: '2rem', boxShadow: '0 20px 60px rgba(24,20,69,0.08)', flex: 1, display: 'flex', flexDirection: 'column', minHeight: '600px' }}>

            {/* Step Header */}
            <div style={{ flexShrink: 0 }}>
              {step !== 7 && (
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--color-surface-low)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                    <Sparkles size={24} style={{ color: 'var(--color-shakti-primary)' }} />
                  </div>
                  <h2 style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-shakti-dark-text)', margin: '0 0 6px' }}>{stepTitles[step-1].title}</h2>
                  <p style={{ fontSize: '14px', color: 'var(--color-outline)', margin: 0, lineHeight: 1.5 }}>{stepTitles[step-1].sub}</p>
                </div>
              )}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px', paddingBottom: '16px' }}>

            {/* STEP 1 */}
            {step === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div><label style={labelStyle}>Full Name</label><input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" style={inputStyle} onFocus={focusIn} onBlur={focusOut} /></div>
                <div><label style={labelStyle}>Age</label><input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="E.g. 24" style={inputStyle} onFocus={focusIn} onBlur={focusOut} /></div>
                <div><label style={labelStyle}>Phone Number</label><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXXXXXXX" style={inputStyle} onFocus={focusIn} onBlur={focusOut} /></div>
                <div><label style={labelStyle}>City / Location</label><input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="E.g. Mumbai, India" style={inputStyle} onFocus={focusIn} onBlur={focusOut} /></div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Occupation</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {['Student', 'Working Professional', 'Job Seeker', 'Entrepreneur', 'Other'].map(occ => (
                      <div key={occ} style={occ === 'Other' ? { gridColumn: 'span 2' } : {}}>
                        <OptionBtn label={occ} selected={occupation === occ} onClick={() => setOccupation(occ)} />
                      </div>
                    ))}
                  </div>
                  {occupation === 'Other' && <motion.input initial={{ opacity: 0 }} animate={{ opacity: 1 }} type="text" value={otherOccupation} onChange={e => setOtherOccupation(e.target.value)} placeholder="Please specify" style={{ ...inputStyle, marginTop: '10px' }} onFocus={focusIn} onBlur={focusOut} />}
                </div>
                <div>
                  <label style={labelStyle}>Main Goals (Select up to 3)</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {['Safety', 'Job Opportunities', 'Learning Tech Skills', 'Mental Health Support', 'Networking'].map(g => (
                      <OptionBtn key={g} label={g} selected={mainGoals.includes(g)} onClick={() => toggleArrayItem(setMainGoals, mainGoals, g, 3)} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Emergency Contacts (Min 1, Max 3)</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {emergencyContacts.map((c, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{ padding: '16px', borderRadius: '16px', background: 'var(--color-surface-low)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-shakti-primary)' }}>Contact {i+1}</span>
                          {i > 0 && <button onClick={() => removeContact(i)} style={{ background: 'var(--color-surface-lowest)', border: 'none', padding: '6px', borderRadius: '8px', cursor: 'pointer', color: '#f43f5e', display: 'flex' }}><Trash2 size={14} /></button>}
                        </div>
                        <input type="text" value={c.name} onChange={e => updateContact(i,'name',e.target.value)} placeholder="Name" style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                        <input type="tel" value={c.phone} onChange={e => updateContact(i,'phone',e.target.value)} placeholder="Phone" style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                        <input type="text" value={c.relation} onChange={e => updateContact(i,'relation',e.target.value)} placeholder="Relation" style={inputStyle} onFocus={focusIn} onBlur={focusOut} />
                      </motion.div>
                    ))}
                    {emergencyContacts.length < 3 && (
                      <button onClick={addContact} style={{ width: '100%', padding: '14px', borderRadius: '14px', border: '2px dashed var(--color-surface-container)', background: 'transparent', color: 'var(--color-outline)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px', fontWeight: 500, fontFamily: 'var(--font-sans)' }}>
                        <Plus size={16} /> Add another contact
                      </button>
                    )}
                  </div>
                </div>
                <div style={{ borderTop: '1px solid var(--color-surface-container)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div><label style={labelStyle}>Preferred SOS Trigger</label><div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{['Button', 'Voice Command', 'Gesture (Power button / shake)'].map(t => <OptionBtn key={t} label={t} selected={sosTrigger === t} onClick={() => setSosTrigger(t)} />)}</div></div>
                  <div><label style={labelStyle}>Travel at night?</label><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>{['Yes','No'].map(a => <OptionBtn key={a} label={a} selected={travelAtNight === a} onClick={() => setTravelAtNight(a)} />)}</div></div>
                  <div><label style={labelStyle}>Location Tracking</label><OptionBtn label="Allow (Recommended)" selected={locationTracking === 'Allow (Recommended)'} onClick={() => { setLocationTracking('Allow (Recommended)'); requestLocation(); }} /></div>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div><label style={labelStyle}>Support needed most?</label><div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{['Immediate Safety Alerts','Career Guidance','Emotional Support','Community Help'].map(s => <OptionBtn key={s} label={s} selected={supportNeeded === s} onClick={() => setSupportNeeded(s)} />)}</div></div>
                <div><label style={labelStyle}>How often stressed?</label><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>{['Rarely','Sometimes','Often'].map(f => <OptionBtn key={f} label={f} selected={stressFrequency === f} onClick={() => setStressFrequency(f)} />)}</div></div>
                <div><label style={labelStyle}>AI mood tracking?</label><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>{['Yes','No'].map(a => <OptionBtn key={a} label={a} selected={wantMoodTracking === a} onClick={() => setWantMoodTracking(a)} />)}</div></div>
                <div><label style={labelStyle}>Preferred support</label><div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{['Chat-based support','Activities (meditation, tips)'].map(a => <OptionBtn key={a} label={a} selected={supportType === a} onClick={() => setSupportType(a)} />)}</div></div>
              </div>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div><label style={labelStyle}>Skills you have</label><input type="text" value={skillsHave} onChange={e => setSkillsHave(e.target.value)} placeholder="e.g., Coding, Teaching" style={inputStyle} onFocus={focusIn} onBlur={focusOut} /></div>
                <div><label style={labelStyle}>Skills to learn</label><input type="text" value={skillsWant} onChange={e => setSkillsWant(e.target.value)} placeholder="e.g., Python, Public Speaking" style={inputStyle} onFocus={focusIn} onBlur={focusOut} /></div>
                <div><label style={labelStyle}>Looking for</label><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>{['Job','Internship','Freelance Work','Just Exploring'].map(l => <OptionBtn key={l} label={l} selected={lookingFor === l} onClick={() => setLookingFor(l)} />)}</div></div>
              </div>
            )}

            {/* STEP 6 */}
            {step === 6 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div><label style={labelStyle}>Would you like to (Select multiple)</label><div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>{['Join local support groups','Be a volunteer helper','Stay anonymous'].map(o => <OptionBtn key={o} label={o} selected={communityOptions.includes(o)} onClick={() => toggleArrayItem(setCommunityOptions, communityOptions, o)} />)}</div></div>
                <div><label style={labelStyle}>Enable nearby alerts?</label><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>{['Yes','No'].map(a => <OptionBtn key={a} label={a} selected={enableNearbyAlerts === a} onClick={() => setEnableNearbyAlerts(a)} />)}</div></div>
              </div>
            )}

            {/* STEP 7 */}
            {step === 7 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ textAlign: 'center', paddingTop: '8px' }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '72px', height: '72px', borderRadius: '22px', marginBottom: '20px', background: 'linear-gradient(135deg, #10B981, #0d9488)', boxShadow: '0 8px 24px rgba(16,185,129,0.3)' }}>
                    <Shield size={34} color="white" />
                  </motion.div>
                  <h2 style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--color-shakti-dark-text)', margin: '0 0 12px' }}>Smart Scenario</h2>
                  <div style={{ padding: '14px 18px', borderRadius: '14px', background: 'var(--color-surface-low)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: 'linear-gradient(180deg, #630ed4, #db2777)' }} />
                    <p style={{ fontSize: '14px', color: 'var(--color-shakti-dark-muted)', fontWeight: 500, fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>"Imagine you're walking alone at night..."</p>
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Do you want SHAKTI AI to:</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {['Auto-detect danger', 'Alert nearby users', 'Track your journey live'].map(p => (
                      <OptionBtn key={p} label={p} selected={scenarioPrefs.includes(p)} onClick={() => toggleArrayItem(setScenarioPrefs, scenarioPrefs, p)} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            </div>

            {/* NAV BUTTONS */}
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '20px', borderTop: '1px solid var(--color-surface-container)' }}>
              {step > 1 ? (
                <button onClick={() => setStep(step - 1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--color-outline)', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 14px', borderRadius: '12px', fontFamily: 'var(--font-sans)' }}>
                  <ArrowLeft size={16} /> Back
                </button>
              ) : <div />}
              {step < 7 ? (
                <button onClick={() => setStep(step + 1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 28px', borderRadius: '999px', background: 'linear-gradient(135deg, #630ed4, #db2777)', color: 'white', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 16px rgba(99,14,212,0.25)', fontFamily: 'var(--font-sans)' }}>
                  Next <ArrowRight size={16} />
                </button>
              ) : (
                <button onClick={handleComplete} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '12px 28px', borderRadius: '999px', background: 'linear-gradient(135deg, #10B981, #0d9488)', color: 'white', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer', boxShadow: '0 6px 16px rgba(16,185,129,0.25)', fontFamily: 'var(--font-sans)' }}>
                  Complete <Sparkles size={16} />
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
