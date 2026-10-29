import { ImageResponse } from 'next/og';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
  return new ImageResponse(<div style={{display:'flex',flexDirection:'column',justifyContent:'center',width:'100%',height:'100%',padding:80,background:'linear-gradient(120deg,#10111b,#292041)',color:'#f8f7ff'}}><div style={{fontSize:32,color:'#b8a2ff'}}>JKBeat / OPEN SOURCE. OPEN POSSIBILITIES.</div><div style={{fontSize:100,fontWeight:900,marginTop:45}}>Your music.</div><div style={{fontSize:100,fontWeight:900,color:'#b7a0ff'}}>Your rules.</div><div style={{fontSize:25,marginTop:30}}>Android · Windows · Linux · macOS</div></div>,size);
}
