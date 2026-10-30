import * as searchTouristPlaces from '../tools/searchTouristPlaces';
import * as searchDiscoverBharat from '../tools/searchDiscoverBharat';
import { validToolInput, consequentialTools, privateTools } from './toolSafety';
import * as searchHeritageKnowledge from '../tools/searchHeritageKnowledge';
import * as searchHiddenGems from '../tools/searchHiddenGems';
import * as searchHotels from '../tools/searchHotels';
import * as searchRestaurants from '../tools/searchRestaurants';
import * as getTransportOptions from '../tools/getTransportOptions';
import * as getWeather from '../tools/getWeather';
import * as getUserLocation from '../tools/getUserLocation';
import * as getCurrentDatetime from '../tools/getCurrentDatetime';
import * as getActiveItinerary from '../tools/getActiveItinerary';
import * as updateItinerary from '../tools/updateItinerary';
import * as getUserProfile from '../tools/getUserProfile';
import * as estimateBudget from '../tools/estimateBudget';
import * as searchMarkets from '../tools/searchMarkets';
import * as getSavedTrips from '../tools/getSavedTrips';
import * as saveCurrentTrip from '../tools/saveCurrentTrip';
import * as getSiteContent from '../tools/getSiteContent';
import * as initiateBookingHandoff from '../tools/initiateBookingHandoff';
import * as getEventsCalendar from '../tools/getEventsCalendar';
import * as getNearbyEmergencyServices from '../tools/getNearbyEmergencyServices';

export interface ToolModule {
  declaration: {
    name: string;
    description: string;
    parameters?: any;
  };
  execute: (args: any, context?: any) => Promise<any>;
}

export const toolRegistry: Record<string, ToolModule> = {
  searchHeritageKnowledge,
  searchTouristPlaces,
  searchDiscoverBharat,
  searchHiddenGems,
  searchHotels,
  searchRestaurants,
  getTransportOptions,
  getWeather,
  getUserLocation,
  getCurrentDatetime,
  getActiveItinerary,
  updateItinerary,
  getUserProfile,
  estimateBudget,
  searchMarkets,
  getSavedTrips,
  saveCurrentTrip,
  getSiteContent,
  initiateBookingHandoff,
  getEventsCalendar,
  getNearbyEmergencyServices,
};

/**
 * Returns all function declarations registered with the local Virasat engine
 */
export function getToolDeclarations() {
  return [
    {
      functionDeclarations: Object.values(toolRegistry).map((t) => t.declaration),
    },
  ];
}

/**
 * Executes a registered tool by name with arguments and live context
 */
export async function executeTool(name: string, args: any, context?: any): Promise<any> {
  const tool = Object.prototype.hasOwnProperty.call(toolRegistry, name) ? toolRegistry[name] : undefined;
  if (!tool) {
    return {
      error: `Tool "${name}" is not registered in Virasat AI Tool Registry.`,
      available_tools: Object.keys(toolRegistry),
    };
  }

  if (!validToolInput(args || {}, tool.declaration.parameters || { type: 'object', properties: {} })) return { error: 'INVALID_TOOL_INPUT' };
  // AI cannot grant itself confirmation or authorize writes through page metadata.
  // Persistent changes remain owned by authenticated application endpoints.
  if (consequentialTools.has(name)) return { error: 'ACTION_REQUIRES_APPLICATION_CONFIRMATION' };
  if (name === 'getTransportOptions' && context?.metadata?.origin_missing) return { error: 'ORIGIN_REQUIRED', message: 'Ask for the current city or permission to use Location. Do not use a default origin.' };
  if (privateTools.has(name) && !context?.user?.id) return { error: 'AUTHENTICATION_REQUIRED' };
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      tool.execute(args || {}, context),
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('TOOL_TIMEOUT')), 10000); }),
    ]);
  } catch {
    return { error: 'TOOL_UNAVAILABLE', tool: name };
  } finally { if (timer) clearTimeout(timer); }
}

export function getAllToolNames(): string[] {
  return Object.keys(toolRegistry);
}
