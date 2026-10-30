import React from 'react';
import { UniversalMasterStateDirectory } from './UniversalMasterStateDirectory';
import { STATE_DIRECTORIES_MAP } from '../../data/masterStateDirectoryConfig';

interface TripuraDirectorySectionProps {
  initialCityId?: string;
  onSelectCity?: (cityId: string) => void;
  onOpenAIChat?: (prompt?: string) => void;
}

export const TripuraDirectorySection: React.FC<TripuraDirectorySectionProps> = (props) => {
  const config = STATE_DIRECTORIES_MAP['tripura'];
  if (!config) return null;

  return (
    <UniversalMasterStateDirectory
      config={config}
      {...props}
    />
  );
};
