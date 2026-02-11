import EstimateDrywallBlocks from "@/components/EstimateDrywallBlocks";
import EstimatePaintBlocks from "@/components/EstimatePaintBlocks";
import SectionOverview from "../SectionOverview";
import PageHeader from "../PageHeader";
import GeneralData from "../GeneralEstimate/GeneralData";
import { useState } from "react";
import SelectionSKUBlock from "../SelectionSKUBlock";
import { COMMON_DRYWALL_SKU_PRESETS } from "../../constants/presetDrywallSKU";
import { COMMON_PAINTING_SKU_PRESETS } from "../../constants/persetPaintingSKU";
import { Box, Paper } from "@mui/material";

const drywallSKUs = COMMON_DRYWALL_SKU_PRESETS;
const paintingSKUs = COMMON_PAINTING_SKU_PRESETS;

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
        <Paper key={section.id} sx={{ marginBottom: 4, p: 3 }}>
          <SectionOverview
            key={section.id}
            section={section}
            onChangeSectionData={() => {}}
            onImagesChange={() => {}}
          />
          <SelectionSKUBlock label="Drywall presets" legoBlocks={drywallSKUs} />
          {/* <EstimateDrywallBlocks /> */}
          <SelectionSKUBlock
            label="Painting presets"
            legoBlocks={paintingSKUs}
          />
          {/* <EstimatePaintBlocks /> */}
        </Paper>
      ))}
    </>
  );
};

export default LegoBlockEstimationPage;
