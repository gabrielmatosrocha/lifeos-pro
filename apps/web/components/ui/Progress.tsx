type Props = {
value:number;
};

export function Progress({value}:Props){

return(

<div className="h-3 w-full overflow-hidden rounded-full border border-white/10 bg-white/[0.08] shadow-inner shadow-black/30">

<div

className="
h-full
rounded-full
bg-gradient-to-r
from-cyan-400
to-green-400
transition-all
duration-700
shadow-[0_0_22px_rgba(34,211,238,.28)]
"

style={{width:`${value}%`}}

/>

</div>

)

}

export default Progress;
