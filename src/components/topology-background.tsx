import React, { useState, useEffect, useRef } from "react";
import TOPOLOGY from "vanta/dist/vanta.topology.min";
import p5 from "p5";
import * as THREE from "three";

(window as any).p5 = p5; // ✅ Only p5 is needed

declare module "vanta/dist/vanta.topology.min";

const TopologyBackground: React.FC = () => {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const myRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!vantaEffect && myRef.current) {
      setVantaEffect(
        TOPOLOGY({
          el: myRef.current,
          THREE: THREE,
          // mouseControls: true,
          // touchControls: true,
          // gyroControls: false,
          // minHeight: 200.0,
          // minWidth: 200.0,
          // scale: 1.0,
          // scaleMobile: 1.0,
          // color: 0x3ded9f,
          // backgroundColor: 0xffffff,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div ref={myRef} style={{ width: "100%", height: "100vh" }}>
      TEIH
    </div>
  );
};

export default TopologyBackground;
