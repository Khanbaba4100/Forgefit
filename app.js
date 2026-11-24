const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],today=()=>new Date().toISOString().slice(0,10);
const plan=[
['Monday','MON','Upper body strength','Strength','45–55 min','Chest, back, shoulders and arms',[
['Chest press machine','3 × 10–12','Set handles at mid-chest, feet flat. Press forward smoothly and return slowly.','Keep shoulders relaxed; do not arch your back.'],
['Lat pulldown','3 × 10–12','Secure thighs and sit tall. Pull bar toward upper chest, then slowly straighten arms.','Never pull behind your neck or swing.'],
['Seated row','3 × 10–12','Sit tall. Pull handles toward lower ribs, squeeze shoulder blades gently, return slowly.','Do not jerk or round your back.'],
['Shoulder press machine','2 × 10','Handles at shoulder height. Press up smoothly, lower with control.','Use light weight; stop if shoulder pinches.'],
['Biceps curl machine','2 × 12','Align elbows with pivot and keep upper arms supported. Curl, then lower slowly.','Avoid swinging.'],
['Triceps pressdown','2 × 12','Keep elbows near ribs. Push cable down, then return slowly.','Keep shoulders relaxed.']]],
['Tuesday','TUE','Cardio + core','Cardio','40–50 min','Build stamina and strengthen your midsection',[
['Treadmill brisk walk','20 min','Comfortable pace, 0–2% incline. Walk at a pace you can talk through.','Reduce speed if breathing becomes uncomfortable.'],
['Abdominal crunch machine','2 × 12','Adjust range comfortably. Curl ribs toward hips, then return slowly.','Do not pull your neck or use momentum.'],
['Bird dog','2 × 8 each side','On hands and knees, extend opposite arm and leg. Pause, then switch.','Keep hips level.'],
['Dead bug','2 × 8 each side','On back, knees above hips. Lower opposite arm and leg slowly.','Shorten range if lower back arches.']]],
['Wednesday','WED','Lower body strength','Strength','45–55 min','Legs, glutes and controlled movement',[
['Leg press','3 × 10–12','Feet shoulder-width. Lower slowly, then press through mid-foot.','Do not lock knees or let back round.'],
['Seated leg curl','3 × 10–12','Align knee with pivot. Curl heels down and back, then return slowly.','Keep hips against seat.'],
['Leg extension','2 × 12','Align knee with pivot. Straighten smoothly and lower under control.','Do not snap knees straight.'],
['Hip abductor','2 × 12–15','Sit upright, press knees outward, pause and return slowly.','Avoid bouncing.'],
['Glute bridge','2 × 12','Lie with knees bent. Squeeze glutes and lift hips gently.','Do not overarch lower back.'],
['Calf raise','2 × 12–15','Rise onto toes, pause, then lower heels under control.','No bouncing.']]],
['Thursday','THU','Mobility + steady cardio','Recovery','35–45 min','Move well and recover actively',[
['Treadmill or bike','25 min','Choose low-impact equipment and a steady easy pace.','You should be able to speak comfortably.'],
['Standing chest opener','2 × 20 sec','Stand tall and gently open chest.','Do not force shoulders backward.'],
['Hip flexor stretch','2 × 20 sec each','Split stance, gently tuck pelvis and shift forward.','Avoid arching lower back.'],
['Cat-cow','1 × 8','On hands and knees, slowly round then gently extend spine.','Move comfortably.'],
['Hamstring stretch','2 × 20 sec each','Heel on low step, hinge forward from hips.','Keep spine long; do not bounce.']]],
['Friday','FRI','Full-body strength','Strength','45–55 min','Practice the main movement patterns',[
['Chest press machine','2 × 10–12','Handles at mid-chest. Press forward and return slowly.','Keep shoulders relaxed.'],
['Lat pulldown','2 × 10–12','Sit tall, pull bar toward upper chest, control return.','Do not swing or pull behind neck.'],
['Leg press','3 × 10–12','Lower with control and press through mid-foot.','Do not lock knees.'],
['Seated row','2 × 10–12','Pull toward lower ribs and slowly reach forward.','Avoid jerking.'],
['Dumbbell Romanian deadlift','2 × 10','Very light dumbbells, knees soft. Push hips back, weights close to thighs, stand tall.','Ask gym staff to check form; keep back neutral.'],
['Plank','2 × 20 sec','Elbows under shoulders; knees-down version is fine. Brace gently.','Stop before hips sag or back hurts.']]],
['Saturday','SAT','Rest day','Rest','Recovery','Rest, hydrate and take an easy walk if you like.',[]],
['Sunday','SUN','Rest day','Rest','Recovery','Prepare for the week and prioritize sleep.',[]]
];
const defaults={targets:{cal:2150,pro:140,carb:230,fat:70},meals:[],workouts:[],measurements:[],photos:[],sets:{}};
let data;try{data={...defaults,...JSON.parse(localStorage.getItem('forgefit-data')||'{}')}}catch{data=structuredClone(defaults)}let selected=0;
const save=()=>{localStorage.setItem('forgefit-data',JSON.stringify(data));render()};
const pct=(v,g)=>Math.min(100,Math.round(v/Math.max(1,g)*100));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function totals(){return data.meals.filter(m=>m.date===today()).reduce((a,m)=>({cal:a.cal+m.cal,pro:a.pro+m.pro,carb:a.carb+m.carb,fat:a.fat+m.fat}),{cal:0,pro:0,carb:0,fat:0})}
function navigate(id){$$('.page').forEach(p=>p.classList.toggle('active',p.id===id));$$('nav button').forEach(b=>b.classList.toggle('chosen',b.dataset.page===id));window.scrollTo(0,0)}
$$('nav button').forEach(b=>b.onclick=()=>navigate(b.dataset.page));
document.addEventListener('click',e=>{const go=e.target.closest('[data-go]');if(go)navigate(go.dataset.go);const d=e.target.closest('[data-day]');if(d){selected=+d.dataset.day;workout()}const v=e.target.closest('[data-video]');if(v)window.open('https://www.youtube.com/results?search_query='+encodeURIComponent(v.dataset.video),'_blank','noopener');const r=e.target.closest('[data-remove]');if(r){data.meals=data.meals.filter(m=>m.id!==r.dataset.remove);save()}});
document.addEventListener('change',e=>{if(e.target.dataset.set){const [day,i,field]=e.target.dataset.set.split('-'),k=day+'-'+i;data.sets[k]??={};data.sets[k][field]=e.target.value;localStorage.setItem('forgefit-data',JSON.stringify(data))}});
function home(){const t=totals(),g=data.targets;$('#hcal').textContent=t.cal;$('#hpro').textContent=t.pro+'g';$('#calbar').style.width=pct(t.cal,g.cal)+'%';$('#probar').style.width=pct(t.pro,g.pro)+'%';const now=new Date(),monday=new Date(now);monday.setDate(now.getDate()-((now.getDay()+6)%7));const completed=data.workouts.filter(w=>new Date(w.date+'T12:00:00')>=monday);$('#hwork').textContent=completed.length;$('#hweight').textContent=data.measurements.at(-1)?.weight||175;$('#date').textContent=now.toLocaleDateString(undefined,{month:'short',day:'numeric'});$('#week').innerHTML=plan.map((p,i)=>`<div><b>${p[1]}</b><span>${'MTWTFSS'[i]}</span><em>${p[3]==='Rest'?'REST':completed.some(w=>w.day===i)?'DONE':'●'}</em></div>`).join('')}
function workout(){const p=plan[selected];$('#days').innerHTML=plan.map((x,i)=>`<button class="day ${i===selected?'active':''}" data-day="${i}">${x[1]}</button>`).join('');$('#workoutBody').innerHTML=`<div class="summary"><div><b>${p[2]}</b><br><small>${p[5]}</small></div><small>${p[4]}</small></div>`+(p[6].length?p[6].map((x,i)=>{const k=selected+'-'+i,s=data.sets[k]||{};return `<article class="ex"><b>${i+1}. ${x[0]}</b> <small>${x[1]}</small><p><b>How to:</b> ${x[2]}<br><b>Safety:</b> ${x[3]}</p><label>Weight (lb) <input type="number" min="0" data-set="${k}-weight" value="${s.weight||''}" placeholder="Optional"> &nbsp; Reps <input type="number" min="0" data-set="${k}-reps" value="${s.reps||''}" placeholder="Done"></label><button class="mini" data-video="${x[0]} beginner exercise tutorial">▶ Find video tutorial</button></article>`}).join(''):'<div class="tip"><b>RECOVERY DAY</b><p>'+p[5]+'</p></div>')}
function nutrition(){const t=totals(),g=data.targets;$('#ncal').textContent=t.cal;$('#macros').innerHTML=[['Protein',t.pro,g.pro],['Carbs',t.carb,g.carb],['Fat',t.fat,g.fat]].map(x=>`<div class="macro"><span>${x[0]}</span><b>${x[1]}g / ${x[2]}g</b><div class="bar"><i style="width:${pct(x[1],x[2])}%"></i></div></div>`).join('');$('#meals').innerHTML=data.meals.filter(m=>m.date===today()).map(m=>`<div class="meal"><div><b>${esc(m.name)}</b><small>${m.cal} kcal · ${m.pro}g protein · ${m.carb}g carbs · ${m.fat}g fat</small></div><button data-remove="${m.id}">Remove</button></div>`).join('')||'<p class="note">No meals logged yet.</p>'}
function calendar(){$('#calendarBody').innerHTML=plan.map(p=>`<article class="${p[3]==='Rest'?'rest':''}"><b>${p[0]}</b><span>${p[2].toUpperCase()}</span><p>${p[5]}</p></article>`).join('')}
function progress(){$('#history').innerHTML=[...data.measurements].reverse().map(m=>`<div class="record"><div><b>${m.weight} lb ${m.waist?'· '+m.waist+' in waist':''}</b><small>${m.date}</small></div></div>`).join('')||'<p class="note">No measurements saved yet.</p>';$('#photos').innerHTML=data.photos.map(src=>`<img src="${src}" alt="Progress photo">`).join('')}
function settings(){[['targetCal','cal'],['targetPro','pro'],['targetCarb','carb'],['targetFat','fat']].forEach(([id,k])=>$('#'+id).value=data.targets[k])}
function render(){home();workout();nutrition();calendar();progress();settings()}
$('#mealForm').onsubmit=e=>{e.preventDefault();data.meals.push({id:String(Date.now()),date:today(),name:$('#mealName').value,cal:+$('#mealCal').value,pro:+$('#mealPro').value,carb:+$('#mealCarb').value||0,fat:+$('#mealFat').value||0});e.target.reset();save()};
$('#finish').onclick=()=>{if(plan[selected][3]==='Rest'){alert('Enjoy your rest day!');return}if(data.workouts.some(w=>w.date===today()&&w.day===selected)){alert('Already saved for today.');return}data.workouts.push({date:today(),day:selected});save();alert('Workout saved. Great work!')};
$('#measureForm').onsubmit=e=>{e.preventDefault();const w=+$('#weight').value,z=+$('#waist').value;if(!w&&!z)return;data.measurements.push({date:today(),weight:w||data.measurements.at(-1)?.weight||175,waist:z||''});e.target.reset();save()};
$('#photo').onchange=e=>{const f=e.target.files[0];if(!f)return;if(f.size>1500000){alert('Choose a photo smaller than 1.5 MB.');return}const r=new FileReader();r.onload=()=>{data.photos.push(r.result);save()};r.readAsDataURL(f)};
$('#saveTargets').onclick=()=>{data.targets={cal:+$('#targetCal').value||2150,pro:+$('#targetPro').value||140,carb:+$('#targetCarb').value||230,fat:+$('#targetFat').value||70};save();alert('Targets saved.')};
$('#export').onclick=()=>{const a=document.createElement('a'),u=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));a.href=u;a.download='forgefit-backup.json';a.click();URL.revokeObjectURL(u)};
$('#import').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const x=JSON.parse(r.result);if(!x.targets||!Array.isArray(x.meals))throw Error();data={...defaults,...x};save();alert('Backup imported.')}catch{alert('Invalid ForgeFit backup file.')}};r.readAsText(f)};
$('#reset').onclick=()=>{if(confirm('Delete all ForgeFit data stored in this browser?')){data=structuredClone(defaults);save()}};
render();if('serviceWorker'in navigator&&location.protocol.startsWith('http'))addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));