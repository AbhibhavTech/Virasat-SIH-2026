import React from 'react';
import { UniversalMasterStateDirectory } from './UniversalMasterStateDirectory';
import { STATE_DIRECTORIES_MAP } from '../../data/masterStateDirectoryConfig';

interface ChandigarhDirectorySectionProps {
  initialCityId?: string;
  onSelectCity?: (cityId: string) => void;
  onOpenAIChat?: (prompt?: string) => void;
}

export const ChandigarhDirectorySection: React.FC<ChandigarhDirectorySectionProps> = (props) => {
  const config = STATE_DIRECTORIES_MAP['chandigarh'];
  if (!config) return null;

  return (
    <UniversalMasterStateDirectory
      config={config}
      {...props}
    />
  );
};
