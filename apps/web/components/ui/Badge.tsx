type Props = {
    children: React.ReactNode;
};

export default function Badge({children}:Props){

return(

<div className="
inline-flex
rounded-full
bg-green-500/20
text-green-400
px-3
py-1
text-xs
font-semibold
border
border-green-500/30
">

{children}

</div>

)

}
