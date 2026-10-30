import React from 'react';
import { UniversalMasterStateDirectory } from './UniversalMasterStateDirectory';
import { STATE_DIRECTORIES_MAP } from '../../data/masterStateDirectoryConfig';

interface DamanDiuDirectorySectionProps {
  initialCityId?: string;
  onSelectCity?: (cityId: string) => void;
  onOpenAIChat?: (prompt?: string) => void;
}

export const DamanDiuDirectorySection: React.FC<DamanDiuDirectorySectionProps> = (props) => {
  const config = STATE_DIRECTORIES_MAP['dadra-and-nagar-haveli-and-daman-and-diu'];
  if (!config) return null;

  return (
    <UniversalMasterStateDirectory
      config={config}
      {...props}
    />
  );
};
