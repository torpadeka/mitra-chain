"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  ExternalLink,
  Share2,
  UserPlus,
  CheckCircle,
  Building2,
  Loader2,
} from "lucide-react";
import { useUser } from "@/context/AuthContext";
import { EventHandler, FrontendEvent } from "@/handler/EventHandler";
import { useNavigate, useParams } from "react-router";

type EventCategory =
  | "Expo"
  | "Webinar"
  | "Workshop"
  | "Networking"
  | "Bazaar"
  | "DiscoveryDay";

// Mock franchise data
const mockFranchises = [
  { id: 1, name: "Green Leaf Cafe", logo: "/cafe-franchise.png" },
  { id: 2, name: "FitZone Gym", logo: "/gym-franchise.png" },
  { id: 3, name: "EduSmart Learning Center", logo: "/education-franchise.png" },
  { id: 4, name: "AutoCare Service", logo: "/auto-franchise.png" },
  { id: 5, name: "CleanPro Services", logo: "/cleaning-franchise.png" },
];

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

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, actor, login } = useUser();
  const [event, setEvent] = useState<FrontendEvent | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      const eventId = Number.parseInt(id as string);

      if (!actor) {
        // setError("Backend connection not available");
        setLoading(false);
        return;
      }

      const eventHandler = new EventHandler(actor);

      try {
        const fetchedEvent = await eventHandler.getEventDetails(eventId);

        if (!fetchedEvent) {
          setError("Event not found");
          setLoading(false);
          return;
        }

        setEvent(fetchedEvent);

        if (user && user.principal) {
          const isUserRegistered = await eventHandler.isAttendee(
            eventId,
            user.principal
          );
          setIsRegistered(isUserRegistered);
        }

        console.log("Fetched event details:", fetchedEvent);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load event details: " + (err as Error).message);
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, user, actor]);

  const handleRegistration = async () => {
    if (!user || !event) return;

    setIsRegistering(true);
    try {
      if (!actor) {
        throw new Error("Backend connection not available");
      }

      const eventHandler = new EventHandler(actor);

      const success = await eventHandler.registerInEvents(event.id);

      if (success) {
        setIsRegistered(true);
        const updatedEvent = await eventHandler.getEventDetails(event.id);
        if (updatedEvent) {
          setEvent(updatedEvent);
        }
        console.log("Successfully registered for event");
      } else {
        throw new Error("Registration failed");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Registration failed: " + (error as Error).message);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title,
          text: event?.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    }).format(date);
  };

  const getDuration = (start: Date, end: Date) => {
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes > 0 ? `${diffMinutes}m` : ""}`;
    }
    return `${diffMinutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand mr-3" />
          <span className="text-lg text-secondary">
            Loading event details...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-red-500 mb-4">⚠️</div>
              <h3 className="text-lg font-semibold text-primary mb-2">
                Error Loading Event
              </h3>
              <p className="text-secondary mb-4">{error}</p>
              <div className="space-y-2">
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full btn-primary"
                >
                  Try Again
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  <a href="/events">Back to Events</a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-secondary mb-4">Event not found</p>
            <Button asChild className="w-full">
              <a href="/events">Back to Events</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const featuredFranchisesList = mockFranchises.filter((franchise) =>
    event.featuredFranchises.includes(franchise.id)
  );

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <a
          href="/events"
          className="inline-flex items-center text-brand hover:text-brand-600 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </a>

        {/* Event Header */}
        <div className="mb-8">
          <div className="aspect-video relative overflow-hidden rounded-lg mb-6">
            <img
              src={event.imageUrl || "https://picsum.photos/300/200"}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge className={categoryColors[event.category]}>
                {event.category}
              </Badge>
              {event.registrationMode === "InviteOnly" && (
                <Badge variant="secondary">Invite Only</Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-serif font-bold text-primary mb-4">
                {event.title}
              </h1>

              {/* Event Meta Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-secondary">
                  <Calendar className="w-5 h-5 mr-3 text-brand" />
                  <div>
                    <p className="font-medium">{formatDate(event.startTime)}</p>
                    <p className="text-sm">
                      {formatTime(event.startTime)} -{" "}
                      {formatTime(event.endTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-secondary">
                  <Clock className="w-5 h-5 mr-3 text-brand" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-sm">
                      {getDuration(event.startTime, event.endTime)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-secondary">
                  <MapPin className="w-5 h-5 mr-3 text-brand" />
                  <div>
                    <p className="font-medium">
                      {event.location.Online
                        ? "Online Event"
                        : event.location.Physical?.city}
                    </p>
                    <p className="text-sm">
                      {event.location.Online
                        ? "Virtual Meeting"
                        : event.location.Physical?.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-secondary">
                  <Users className="w-5 h-5 mr-3 text-brand" />
                  <div>
                    <p className="font-medium">
                      {event.attendees.length} Registered
                    </p>
                    <p className="text-sm">
                      {event.registrationMode} Registration
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Card */}
            <Card className="w-full lg:w-80">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {user ? (
                    <>
                      {isRegistered ? (
                        <div className="flex items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          <span className="text-green-700 dark:text-green-400 font-medium">
                            You're registered!
                          </span>
                        </div>
                      ) : (
                        <Button
                          onClick={handleRegistration}
                          disabled={
                            isRegistering ||
                            event.registrationMode === "InviteOnly"
                          }
                          className="w-full btn-primary"
                        >
                          {isRegistering ? (
                            "Registering..."
                          ) : event.registrationMode === "InviteOnly" ? (
                            "Invite Only"
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Register for Event
                            </>
                          )}
                        </Button>
                      )}

                      {event.location.Online && isRegistered && (
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                          asChild
                        >
                          <a
                            href={event.location.Online}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Join Meeting
                          </a>
                        </Button>
                      )}
                    </>
                  ) : (
                    <div className="text-center">
                      <p className="text-secondary mb-4">
                        Sign in to register for this event
                      </p>
                      <Button
                        asChild
                        className="w-full btn-primary hover:cursor-pointer"
                      >
                        <a onClick={login}>Sign In</a>
                      </Button>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    onClick={handleShare}
                    className="w-full bg-transparent"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Event Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About This Event</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-secondary leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </CardContent>
        </Card>

        {/* Featured Franchises */}
        {featuredFranchisesList.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-brand" />
                Featured Franchises
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredFranchisesList.map((franchise) => (
                  <div
                    key={franchise.id}
                    className="flex items-center p-4 border border-border rounded-lg"
                  >
                    <img
                      src={franchise.logo || "/placeholder.svg"}
                      alt={franchise.name}
                      className="w-12 h-12 rounded-lg mr-3"
                    />
                    <div>
                      <p className="font-medium text-primary">
                        {franchise.name}
                      </p>
                      <a
                        href={`/franchise/${franchise.id}`}
                        className="text-sm text-brand hover:underline"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Attendees */}
        {event.attendees.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>
                Registered Attendees ({event.attendees.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {event.attendees.slice(0, 10).map((attendeeId, index) => (
                  <Avatar key={attendeeId} className="h-10 w-10">
                    <AvatarFallback className="bg-brand-500 text-white text-sm">{`U${index + 1}`}</AvatarFallback>
                  </Avatar>
                ))}
                {event.attendees.length > 10 && (
                  <div className="h-10 w-10 rounded-full bg-surface-secondary flex items-center justify-center">
                    <span className="text-sm text-secondary">
                      +{event.attendees.length - 10}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
