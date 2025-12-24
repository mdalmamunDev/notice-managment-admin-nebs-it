import PageHeading from "../Components/PageHeading";
import { useGetSettingQuery } from "../redux/features/settings/settingApi";
import LoaderWraperComp from "../Components/LoaderWraperComp";

const TermsConditionGlobal = () => {
  const { data, isLoading, isError } = useGetSettingQuery("terms-conditions");

  return (
    <div className="flex flex-col justify-between">
      <div className="space-y-4">
        <div className="p-2 flex justify-between items-center bg-4">
          <PageHeading title="Terms And Conditions" disbaledBackBtn={true} />
        </div>
        <div className="w-full h-[90vh] overflow-auto bg-[#f5f5ff] rounded-md border mx-2">
          <LoaderWraperComp isError={isError} isLoading={isLoading}>
            <div
              className="no-tailwind"
              style={{ padding: "30px 25px" }}
              dangerouslySetInnerHTML={{ __html: data?.data?.value }}
            ></div>
          </LoaderWraperComp>
        </div>
      </div>
    </div>
  );
};

export default TermsConditionGlobal;
