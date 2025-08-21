"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  MapPin,
  Users,
  Search,
  Plus,
  Filter,
  Loader2,
} from "lucide-react";
import { useUser } from "@/context/AuthContext";
import { EventHandler, FrontendEvent } from "@/handler/EventHandler";

type EventCategory =
  | "Expo"
  | "Webinar"
  | "Workshop"
  | "Networking"
  | "Bazaar"
  | "DiscoveryDay";

const categoryColors = {
  Expo: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Webinar: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Workshop: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Networking:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  Bazaar: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  DiscoveryDay:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
};

export default function EventsPage() {
  const { user, actor, principal } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date");
  const [events, setEvents] = useState<FrontendEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      console.log(actor);
      if (!actor || !principal) {
        // setError("Backend connection not available");
        setLoading(false);
        return;
      }

      const eventHandler = new EventHandler(actor);

      try {
        const fetchedEvents = await eventHandler.getAllEvents();
        setEvents(fetchedEvents);
        console.log("Fetched events:", fetchedEvents);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to fetch events: " + (err as Error).message);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [actor, principal]);

  const filteredAndSortedEvents = useMemo(() => {
    const filtered = events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          );
        case "title":
          return a.title.localeCompare(b.title);
        case "category":
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [events, searchQuery, selectedCategory, sortBy]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  const getLocationDisplay = (location: FrontendEvent["location"]) => {
    if (location.Online) {
      return "Online Event";
    }
    if (location.Physical) {
      return `${location.Physical.city}`;
    }
    return "Location TBD";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-brand mr-3" />
            <span className="text-lg text-secondary">Loading events...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-primary mb-2">
                  Error Loading Events
                </h3>
                <p className="text-secondary mb-4">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-primary">
              Franchise Events
            </h1>
            <p className="text-secondary mt-2">
              Discover workshops, networking events, and franchise opportunities
            </p>
          </div>
          {user && (
            <Button asChild className="btn-primary mt-4 md:mt-0">
              <a href="/events/create">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </a>
            </Button>
          )}
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary w-4 h-4" />
                  <Input
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-[180px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Expo">Franchise Expo</SelectItem>
                    <SelectItem value="Webinar">Webinar</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Networking">Networking</SelectItem>
                    <SelectItem value="Bazaar">Business Bazaar</SelectItem>
                    <SelectItem value="DiscoveryDay">Discovery Day</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events Grid */}
        {filteredAndSortedEvents.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-primary mb-2">
                  No events found
                </h3>
                <p className="text-secondary mb-4">
                  {searchQuery || selectedCategory !== "all"
                    ? "Try adjusting your search or filters"
                    : "Be the first to create an event!"}
                </p>
                {user && (
                  <Button asChild className="btn-primary">
                    <a href="/events/create">Create Event</a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedEvents.map((event) => (
              <Card
                key={event.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <a href={`/events/${event.id}`}>
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img
                      src={event.imageUrl || "https://picsum.photos/300/200"}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={categoryColors[event.category]}>
                        {event.category}
                      </Badge>
                    </div>
                    {event.registrationMode === "InviteOnly" && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary">Invite Only</Badge>
                      </div>
                    )}
                  </div>
                </a>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg leading-tight">
                    <a
                      href={`/events/${event.id}`}
                      className="hover:text-brand transition-colors"
                    >
                      {event.title}
                    </a>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-secondary text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-secondary">
                      <Calendar className="w-4 h-4 mr-2 text-brand" />
                      {formatDate(event.startTime)}
                    </div>
                    <div className="flex items-center text-sm text-secondary">
                      <MapPin className="w-4 h-4 mr-2 text-brand" />
                      {getLocationDisplay(event.location)}
                    </div>
                    <div className="flex items-center text-sm text-secondary">
                      <Users className="w-4 h-4 mr-2 text-brand" />
                      {event.attendees.length} registered
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <Button asChild className="w-full btn-primary">
                      <a href={`/events/${event.id}`}>View Details</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
