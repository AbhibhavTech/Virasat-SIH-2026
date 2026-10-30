import React from 'react';
import { UniversalMasterStateDirectory } from './UniversalMasterStateDirectory';
import { STATE_DIRECTORIES_MAP } from '../../data/masterStateDirectoryConfig';

interface BiharDirectorySectionProps {
  initialCityId?: string;
  onSelectCity?: (cityId: string) => void;
  onOpenAIChat?: (prompt?: string) => void;
}

export const BiharDirectorySection: React.FC<BiharDirectorySectionProps> = (props) => {
  const config = STATE_DIRECTORIES_MAP['bihar'];
  if (!config) return null;

  return (
    <UniversalMasterStateDirectory
      config={config}
      {...props}
    />
  );
};
