import React from 'react';
import { UniversalMasterStateDirectory } from './UniversalMasterStateDirectory';
import { STATE_DIRECTORIES_MAP } from '../../data/masterStateDirectoryConfig';

interface MadhyaPradeshDirectorySectionProps {
  initialCityId?: string;
  onSelectCity?: (cityId: string) => void;
  onOpenAIChat?: (prompt?: string) => void;
}

export const MadhyaPradeshDirectorySection: React.FC<MadhyaPradeshDirectorySectionProps> = (props) => {
  const config = STATE_DIRECTORIES_MAP['madhya-pradesh'];
  if (!config) return null;

  return (
    <UniversalMasterStateDirectory
      config={config}
      {...props}
    />
  );
};
