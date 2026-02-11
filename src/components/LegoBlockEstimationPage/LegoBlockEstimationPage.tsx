import SectionOverview from "../SectionOverview";
import PageHeader from "../PageHeader";
import GeneralData from "../GeneralEstimate/GeneralData";
import { useState } from "react";
import SelectionSKUBlock from "../SelectionSKUBlock";
import { COMMON_DRYWALL_SKU_PRESETS } from "../../constants/presetDrywallSKU";
import { COMMON_PAINTING_SKU_PRESETS } from "../../constants/persetPaintingSKU";
import { Paper } from "@mui/material";

const drywallSKUs = COMMON_DRYWALL_SKU_PRESETS;
const paintingSKUs = COMMON_PAINTING_SKU_PRESETS;

const LegoBlockSection = ({
  section,
}: {
  section: { id: string; name: string; description: string };
}) => {
  const onDrywallBlockSelect = (blockIds: string[]) => {
    console.log("Selected drywall blocks:", blockIds);
  };

  const onPaintBlockSelect = (blockIds: string[]) => {
    console.log("Selected paint blocks:", blockIds);
  };

  return (
    <Paper key={section.id} sx={{ marginBottom: 4, p: 3 }}>
      <SectionOverview
        key={section.id}
        section={section}
        onChangeSectionData={() => {}}
        onImagesChange={() => {}}
      />
      <SelectionSKUBlock
        title="Drywall presets"
        legoBlocks={drywallSKUs}
        blockType="drywall"
        onBlockSelect={onDrywallBlockSelect}
      />
      <SelectionSKUBlock
        title="Painting presets"
        legoBlocks={paintingSKUs}
        blockType="painting"
        onBlockSelect={onPaintBlockSelect}
      />
    </Paper>
  );
};

const LegoBlockEstimationPage = () => {
  const [sections, setSections] = useState([
    {
      id: "1",
      name: "Living Room",
      description: "Description of living room",
    },
    {
      id: "2",
      name: "Kitchen",
      description: "Description of kitchen",
    },
  ]);

  return (
    <>
      <PageHeader hideBackButton title="Lego Block Estimation" />
      <GeneralData initialData={null} onFormChange={() => {}} />
      {sections.map((section) => (
        <LegoBlockSection key={section.id} section={section} />
      ))}
    </>
  );
};

export default LegoBlockEstimationPage;
