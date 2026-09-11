import * as searchTouristPlaces from '../tools/searchTouristPlaces';
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
  searchTouristPlaces,
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
 * Returns function declarations array formatted for Gemini API tools config
 */
export function getGeminiToolDeclarations() {
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
  const tool = toolRegistry[name];
  if (!tool) {
    return {
      error: `Tool "${name}" is not registered in Virasat AI Tool Registry.`,
      available_tools: Object.keys(toolRegistry),
    };
  }

  try {
    return await tool.execute(args || {}, context);
  } catch (err: any) {
    console.error(`[AI ToolRegistry] Error executing tool "${name}":`, err);
    return {
      error: `Execution failure in tool "${name}": ${err?.message || 'Unknown error'}`,
    };
  }
}

export function getAllToolNames(): string[] {
  return Object.keys(toolRegistry);
}
