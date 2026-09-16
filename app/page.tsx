export default function Page() {
  return (
    <>
      <div
        style={{
          height: "100vh",
          width: "100vw",
          minHeight: "450px",
          backgroundColor: "#065f46",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "1200px",
            maxWidth: "100%",
            height: "100%",
            backgroundColor: "#7f1d1d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p style={{ color: "#ffffff", fontSize: "55px", textAlign: "center", lineHeight: "1em" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      </div>
      <div style={{ height: "50vh", width: "100vw", minHeight: "450px", backgroundColor: "#40382d" }} />
      <div style={{ height: "50vh", width: "100vw", minHeight: "450px", backgroundColor: "#fcd34d" }} />

    </>
  )
}
