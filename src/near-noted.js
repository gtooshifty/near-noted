import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  DollarSign, 
  Heart, 
  Search, 
  Filter,
  Music,
  ShoppingBag,
  Utensils,
  Palette,
  Trees,
  Users,
  ArrowLeft,
  Star,
  Clock,
  Navigation
} from 'lucide-react';

// Sample Minneapolis event data
const sampleEvents = [
  {
    id: 'nn_evt_001',
    title: 'Vintage Market at Mill City',
    shortDescription: 'Discover unique vintage finds from local vendors',
    category: { primary: 'shopping', secondary: 'vintage', tags: ['vintage', 'market', 'local'] },
    datetime: { start: '2025-06-15T10:00:00', end: '2025-06-15T16:00:00' },
    location: { venue: 'Mill City Museum', address: '704 S 2nd St, Minneapolis', coordinates: { lat: 44.9778, lng: -93.2563 } },
    pricing: { type: 'free', details: 'Free admission' },
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop',
    featured: true,
    editorsPick: true
  },
  {
    id: 'nn_evt_002',
    title: 'First Avenue Concert Series',
    shortDescription: 'Live indie rock featuring local Minneapolis bands',
    category: { primary: 'music', secondary: 'concert', tags: ['music', 'live', 'indie'] },
    datetime: { start: '2025-06-16T20:00:00', end: '2025-06-16T23:30:00' },
    location: { venue: 'First Avenue', address: '701 1st Ave N, Minneapolis', coordinates: { lat: 44.9817, lng: -93.2763 } },
    pricing: { type: 'paid', range: { min: 25, max: 35 }, details: '$25-35' },
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop',
    featured: true
  },
  {
    id: 'nn_evt_003',
    title: 'Northeast Food Truck Rally',
    shortDescription: 'Taste the best food trucks Minneapolis has to offer',
    category: { primary: 'food', secondary: 'food-truck', tags: ['food', 'outdoor', 'family'] },
    datetime: { start: '2025-06-14T11:00:00', end: '2025-06-14T19:00:00' },
    location: { venue: 'Boom Island Park', address: 'Boom Island Park, Minneapolis', coordinates: { lat: 44.9919, lng: -93.2774 } },
    pricing: { type: 'free', details: 'Free entry, food prices vary' },
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=250&fit=crop',
    featured: false
  },
  {
    id: 'nn_evt_004',
    title: 'Walker Art Center Workshop',
    shortDescription: 'Contemporary art workshop for all skill levels',
    category: { primary: 'arts', secondary: 'workshop', tags: ['art', 'workshop', 'creative'] },
    datetime: { start: '2025-06-17T14:00:00', end: '2025-06-17T17:00:00' },
    location: { venue: 'Walker Art Center', address: '725 Vineland Pl, Minneapolis', coordinates: { lat: 44.9685, lng: -93.2881 } },
    pricing: { type: 'paid', range: { min: 15, max: 15 }, details: '$15' },
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=250&fit=crop',
    featured: false
  },
  {
    id: 'nn_evt_005',
    title: 'Minnehaha Falls Hiking Group',
    shortDescription: 'Weekly community hike through Minneapolis parks',
    category: { primary: 'outdoor', secondary: 'hiking', tags: ['hiking', 'nature', 'community'] },
    datetime: { start: '2025-06-18T09:00:00', end: '2025-06-18T12:00:00' },
    location: { venue: 'Minnehaha Park', address: '4801 Minnehaha Ave, Minneapolis', coordinates: { lat: 44.9153, lng: -93.2111 } },
    pricing: { type: 'free', details: 'Free activity' },
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=250&fit=crop',
    featured: false
  },
  {
    id: 'nn_evt_006',
    title: 'Uptown Coffee & Code Meetup',
    shortDescription: 'Weekly gathering for local developers and tech enthusiasts',
    category: { primary: 'community', secondary: 'meetup', tags: ['tech', 'networking', 'coffee'] },
    datetime: { start: '2025-06-19T18:00:00', end: '2025-06-19T20:00:00' },
    location: { venue: 'Blue Bottle Coffee', address: '2912 Hennepin Ave, Minneapolis', coordinates: { lat: 44.9478, lng: -93.2975 } },
    pricing: { type: 'free', details: 'Free meetup' },
    image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=250&fit=crop',
    featured: false
  }
];

const categories = {
  music: { label: 'Music', icon: Music, color: 'bg-purple-100 text-purple-700' },
  shopping: { label: 'Shopping', icon: ShoppingBag, color: 'bg-pink-100 text-pink-700' },
  food: { label: 'Food & Drink', icon: Utensils, color: 'bg-orange-100 text-orange-700' },
  arts: { label: 'Arts & Culture', icon: Palette, color: 'bg-blue-100 text-blue-700' },
  outdoor: { label: 'Outdoor', icon: Trees, color: 'bg-green-100 text-green-700' },
  community: { label: 'Community', icon: Users, color: 'bg-indigo-100 text-indigo-700' }
};

function NearAndNoted() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookmarkedEvents, setBookmarkedEvents] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredEvents = sampleEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category.primary === selectedCategory;
    const matchesPrice = priceFilter === 'all' || 
                        (priceFilter === 'free' && event.pricing.type === 'free') ||
                        (priceFilter === 'paid' && event.pricing.type === 'paid');
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const toggleBookmark = (eventId) => {
    const newBookmarks = new Set(bookmarkedEvents);
    if (newBookmarks.has(eventId)) {
      newBookmarks.delete(eventId);
    } else {
      newBookmarks.add(eventId);
    }
    setBookmarkedEvents(newBookmarks);
  };

  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    };
  };

  const EventCard = ({ event, compact = false }) => {
    const CategoryIcon = categories[event.category.primary]?.icon || MapPin;
    const datetime = formatDateTime(event.datetime.start);
    
    return (
      <div 
        className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${compact ? 'mb-3' : 'mb-4'}`}
        onClick={() => {
          setSelectedEvent(event);
          setCurrentView('detail');
        }}
      >
        <div className="relative">
          <img 
            src={event.image} 
            alt={event.title}
            className={`w-full object-cover ${compact ? 'h-32' : 'h-48'}`}
          />
          {event.editorsPick && (
            <div className="absolute top-2 left-2 bg-teal-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <Star className="w-3 h-3 mr-1" />
              Editor's Pick
            </div>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(event.id);
            }}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
          >
            <Heart 
              className={`w-4 h-4 ${bookmarkedEvents.has(event.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
            />
          </button>
        </div>
        
        <div className={`p-4 ${compact ? 'py-3' : ''}`}>
          <h3 className={`font-semibold text-gray-900 mb-2 ${compact ? 'text-sm' : 'text-lg'}`}>
            {event.title}
          </h3>
          <p className={`text-gray-600 mb-3 ${compact ? 'text-xs' : 'text-sm'}`}>
            {event.shortDescription}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {datetime.date}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {datetime.time}
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {event.location.venue}
              </div>
            </div>
            
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1 text-green-600" />
              <span className="text-sm font-medium text-green-600">
                {event.pricing.type === 'free' ? 'Free' : event.pricing.details}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CategoryButton = ({ category, active, onClick }) => {
    const Icon = categories[category]?.icon || MapPin;
    const isActive = active === category;
    
    return (
      <button
        onClick={() => onClick(category)}
        className={`flex flex-col items-center justify-center p-3 rounded-lg transition-colors ${
          isActive 
            ? 'bg-teal-100 border-2 border-teal-500' 
            : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
        }`}
      >
        <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-teal-700' : 'text-gray-600'}`} />
        <span className={`text-xs font-medium ${isActive ? 'text-teal-700' : 'text-gray-600'}`}>
          {categories[category]?.label || 'All'}
        </span>
      </button>
    );
  };

  const FilterPanel = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-xl p-6 max-h-96 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Filters</h3>
          <button 
            onClick={() => setShowFilters(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Price</h4>
            <div className="space-y-2">
              {['all', 'free', 'paid'].map(price => (
                <label key={price} className="flex items-center">
                  <input
                    type="radio"
                    name="price"
                    checked={priceFilter === price}
                    onChange={() => setPriceFilter(price)}
                    className="mr-2"
                  />
                  <span className="capitalize">{price === 'all' ? 'All Prices' : price}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Category</h4>
            <div className="grid grid-cols-2 gap-2">
              <CategoryButton 
                category="all" 
                active={selectedCategory} 
                onClick={setSelectedCategory}
              />
              {Object.keys(categories).map(cat => (
                <CategoryButton 
                  key={cat}
                  category={cat} 
                  active={selectedCategory} 
                  onClick={setSelectedCategory}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-6">
          <button 
            onClick={() => {
              setPriceFilter('all');
              setSelectedCategory('all');
              setSearchTerm('');
            }}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Clear All
          </button>
          <button 
            onClick={() => setShowFilters(false)}
            className="flex-1 py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );

  const HomeView = () => (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-teal-700">Near & Noted</h1>
            <button 
              onClick={() => setCurrentView('bookmarks')}
              className="p-2 hover:bg-gray-100 rounded-full relative"
            >
              <Heart className="w-6 h-6 text-gray-600" />
              {bookmarkedEvents.size > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {bookmarkedEvents.size}
                </div>
              )}
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button 
              onClick={() => setShowFilters(true)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
            >
              <Filter className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          {/* Location */}
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">Minneapolis, MN</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Editor's Picks */}
        {!searchTerm && selectedCategory === 'all' && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Editor's Picks</h2>
            <div className="space-y-4">
              {sampleEvents.filter(e => e.editorsPick).map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        {!searchTerm && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Categories</h2>
            <div className="grid grid-cols-3 gap-3">
              {Object.keys(categories).map(cat => (
                <CategoryButton 
                  key={cat}
                  category={cat} 
                  active={selectedCategory} 
                  onClick={setSelectedCategory}
                />
              ))}
            </div>
          </div>
        )}

        {/* Events List */}
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-4">
            {searchTerm ? `Search Results (${filteredEvents.length})` : 
             selectedCategory === 'all' ? 'This Week' : 
             `${categories[selectedCategory]?.label} Events`}
          </h2>
          <div className="space-y-4">
            {filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <p className="text-gray-600">No events found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );

  const EventDetailView = () => {
    if (!selectedEvent) return null;
    
    const datetime = formatDateTime(selectedEvent.datetime.start);
    const CategoryIcon = categories[selectedEvent.category.primary]?.icon || MapPin;
    
    return (
      <div className="bg-white min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <button 
            onClick={() => setCurrentView('home')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold">Event Details</h1>
          <button
            onClick={() => toggleBookmark(selectedEvent.id)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Heart 
              className={`w-6 h-6 ${bookmarkedEvents.has(selectedEvent.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
            />
          </button>
        </div>

        {/* Hero Image */}
        <div className="relative">
          <img 
            src={selectedEvent.image} 
            alt={selectedEvent.title}
            className="w-full h-64 object-cover"
          />
          {selectedEvent.editorsPick && (
            <div className="absolute top-4 left-4 bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <Star className="w-4 h-4 mr-1" />
              Editor's Pick
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Event Info */}
          <h1 className="text-2xl font-bold mb-2">{selectedEvent.title}</h1>
          
          <div className="flex items-center mb-4">
            <div className={`p-2 rounded-lg mr-3 ${categories[selectedEvent.category.primary]?.color || 'bg-gray-100'}`}>
              <CategoryIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-medium">{categories[selectedEvent.category.primary]?.label}</div>
              <div className="text-sm text-gray-500">
                {selectedEvent.category.tags.join(' • ')}
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-600 mr-2" />
                <div>
                  <div className="font-medium">{datetime.date}</div>
                  <div className="text-sm text-gray-500">{datetime.time}</div>
                </div>
              </div>
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 text-green-600 mr-1" />
                <span className="font-medium text-green-600">
                  {selectedEvent.pricing.type === 'free' ? 'Free' : selectedEvent.pricing.details}
                </span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <MapPin className="w-5 h-5 text-gray-600 mr-2" />
              <div>
                <div className="font-medium">{selectedEvent.location.venue}</div>
                <div className="text-sm text-gray-500">{selectedEvent.location.address}</div>
              </div>
            </div>
            
            <div className="bg-gray-200 rounded-lg h-32 flex items-center justify-center mb-4">
              <div className="text-center text-gray-500">
                <MapPin className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm">Map View</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">About This Event</h3>
            <p className="text-gray-700">{selectedEvent.shortDescription}</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium flex items-center justify-center hover:bg-gray-200">
              <Navigation className="w-5 h-5 mr-2" />
              Get Directions
            </button>
            <button 
              onClick={() => toggleBookmark(selectedEvent.id)}
              className={`w-full py-3 rounded-lg font-medium flex items-center justify-center ${
                bookmarkedEvents.has(selectedEvent.id)
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-teal-100 text-teal-700 hover:bg-teal-200'
              }`}
            >
              <Heart className="w-5 h-5 mr-2" />
              {bookmarkedEvents.has(selectedEvent.id) ? 'Remove from Saved' : 'Save Event'}
            </button>
            <button className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700">
              View Tickets / RSVP
            </button>
          </div>
        </div>
      </div>
    );
  };

  const BookmarksView = () => {
    const savedEvents = sampleEvents.filter(event => bookmarkedEvents.has(event.id));
    
    return (
      <div className="bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={() => setCurrentView('home')}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-semibold">Saved Events</h1>
              <div className="w-10"></div>
            </div>
          </div>
        </div>

        <div className="px-4 py-6">
          {savedEvents.length > 0 ? (
            <div className="space-y-4">
              {savedEvents.map(event => (
                <EventCard key={event.id} event={event} compact />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Heart className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No saved events yet</h3>
              <p className="text-gray-600 mb-6">Start exploring and save events you're interested in</p>
              <button 
                onClick={() => setCurrentView('home')}
                className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700"
              >
                Discover Events
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-xl">
      {currentView === 'home' && <HomeView />}
      {currentView === 'detail' && <EventDetailView />}
      {currentView === 'bookmarks' && <BookmarksView />}
      {showFilters && <FilterPanel />}
    </div>
  );
}

export default NearAndNoted;