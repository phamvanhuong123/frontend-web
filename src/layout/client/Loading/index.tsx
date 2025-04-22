const Loading = () => {
    const style: React.CSSProperties = {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
    };
  
    return (
      <div style={style}>
        <img
          src="/logo-new.webp"
          alt="Logo"
          style={{
            width: "100px",
            animation: "pulse 1.5s infinite",
          }}
        />
        <p style={{ marginTop: "20px", fontSize: "18px", color: "#36d7b7" }}>
         
        </p>
        <style>
          {`
            @keyframes pulse {
              0%, 100% {
                transform: scale(1);
                opacity: 1;
              }
              50% {
                transform: scale(1.5);
                opacity: 0.5;
              }
            }
          `}
        </style>
      </div>
    );
  };
  
  export default Loading;