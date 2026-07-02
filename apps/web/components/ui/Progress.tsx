type Props = {
value:number;
};

export function Progress({value}:Props){

return(

<div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">

<div

className="
h-full
rounded-full
bg-gradient-to-r
from-cyan-400
to-green-400
transition-all
duration-700
"

style={{width:`${value}%`}}

/>

</div>

)

}

export default Progress;
