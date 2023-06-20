type CustomPageHeaderProps = {
  name?: string;
  currentUrl: string;
  saveToClipboard: (url: string) => void;
};

const CustomPageHeader = ({
  name,
  saveToClipboard,
  currentUrl,
}: CustomPageHeaderProps) => {
  return (
    <>
      {" "}
      <div
        className="d-flex flex-row justify-content-end mt-3"
        style={{ width: "100%" }}
      >
        <button onClick={() => saveToClipboard(currentUrl)} className="btn">
          <img
            src={
              "https://th.bing.com/th/id/R2ac5155460db535e7dc649ec9f5afdee?rik=%2FXMnDS4HFmfXrw&riu=http%3A%2F%2Fgetdrawings.com%2Ffree-icon-bw%2Finstagram-icon-copy-and-paste-6.png&ehk=q%2FFSsFqKp%2BvYYDsOoxcsCf6Ek%2Bj%2FC1sMY5GddVmBqJY%3D&risl=&pid=ImgRaw"
            }
            style={{ width: "30px", height: "30px" }}
            alt="Copy to Clipboard"
          />
        </button>
      </div>
      <div className="d-flex flex-column align-items-center">
        <img
          src={
            "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
          }
          alt="Avatar"
          style={{ width: "50px", height: "50px" }}
          className="rounded-circle"
        />
        <p style={{ fontSize: "30px" }}>{name}</p>
      </div>
    </>
  );
};

export default CustomPageHeader;
