import React from 'react';
import { UniversalMasterStateDirectory } from './UniversalMasterStateDirectory';
import { STATE_DIRECTORIES_MAP } from '../../data/masterStateDirectoryConfig';

interface JharkhandDirectorySectionProps {
  initialCityId?: string;
  onSelectCity?: (cityId: string) => void;
  onOpenAIChat?: (prompt?: string) => void;
}

export const JharkhandDirectorySection: React.FC<JharkhandDirectorySectionProps> = (props) => {
  const config = STATE_DIRECTORIES_MAP['jharkhand'];
  if (!config) return null;

  return (
    <UniversalMasterStateDirectory
      config={config}
      {...props}
    />
  );
};
