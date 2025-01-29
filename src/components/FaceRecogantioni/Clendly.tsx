import { InlineWidget } from "react-calendly";

const Clendly = () => {
  return (
    <div>
      <div className="App">
        {/* <InlineWidget url="https://calendly.com/abhaykumar-synergytechs/30min?preview_source=et_card&hide_gdpr_banner=1" /> */}
        <InlineWidget url="https://calendly.com/abhaykumar-synergytechs?hide_landing_page_details=1&hide_gdpr_banner=1" />
      </div>
    </div>
  );
};

export default Clendly;
