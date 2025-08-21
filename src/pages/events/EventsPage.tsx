import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users } from "lucide-react";
import { EventHandler, FrontendEvent } from "@/handler/EventHandler";

const EventsPage: React.FC = () => {
  const { actor, principal, user, isAuthenticated } = useUser();
  const navigate = useNavigate();
  const [events, setEvents] = useState<FrontendEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!actor) return;

      const eventHandler = new EventHandler(actor);

      if (!eventHandler) {
        setError("Actor not initialized");
        setLoading(false);
        return;
      }

      try {
        const fetchedEvents = await eventHandler.getAllEvents();
        setEvents(fetchedEvents);
        console.log(fetchEvents);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch events: " + (err as Error).message);
        setLoading(false);
      }
    };
    console.log(actor);
    fetchEvents();
  }, []);

  const handleRegister = async (eventId: number) => {
    if (!actor) return;

    const eventHandler = new EventHandler(actor);
    if (!eventHandler || !principal || !isAuthenticated) {
      navigate("/register");
      return;
    }

    try {
      const success = await eventHandler.registerInEvents(eventId);
      if (success) {
        alert("Successfully registered for the event!");
        const updatedEvents = await eventHandler.getAllEvents();
        setEvents(updatedEvents);
      } else {
        alert(
          "Failed to register for the event. You may already be registered or the event is invite-only."
        );
      }
    } catch (err) {
      alert("Error registering for event: " + (err as Error).message);
    }
  };

  const handleCreateEvent = () => {
    if (!isAuthenticated) {
      navigate("/register");
      return;
    }
    navigate("/create-event");
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className="text-center py-10">Loading events...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Events</h1>
        {user && (
          <Button className="btn-primary" onClick={handleCreateEvent}>
            Create New Event
          </Button>
        )}
      </div>

      {events.length === 0 ? (
        <p className="text-center text-secondary">No events available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="bg-surface-primary border-primary">
              <CardHeader>
                <CardTitle className="text-xl text-primary">
                  {event.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={event.imageUrl || "https://via.placeholder.com/300x150"}
                  alt={event.title}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <p className="text-secondary mb-2">
                  <strong>Category:</strong> {event.category}
                </p>
                <p className="text-secondary mb-2">
                  <strong>Description:</strong> {event.description}
                </p>
                <div className="flex items-center mb-2">
                  <Calendar className="w-5 h-5 mr-2 text-brand" />
                  <p className="text-secondary">
                    <strong>Starts:</strong> {formatDate(event.startTime)}
                  </p>
                </div>
                <div className="flex items-center mb-2">
                  <Calendar className="w-5 h-5 mr-2 text-brand" />
                  <p className="text-secondary">
                    <strong>Ends:</strong> {formatDate(event.endTime)}
                  </p>
                </div>
                <div className="flex items-center mb-2">
                  <MapPin className="w-5 h-5 mr-2 text-brand" />
                  <p className="text-secondary">
                    <strong>Location:</strong>{" "}
                    {event.location.Online ? (
                      <a
                        href={event.location.Online}
                        className="text-brand hover:underline"
                      >
                        {event.location.Online}
                      </a>
                    ) : (
                      `${event.location.Physical?.address}, ${event.location.Physical?.city}`
                    )}
                  </p>
                </div>
                <div className="flex items-center mb-2">
                  <Users className="w-5 h-5 mr-2 text-brand" />
                  <p className="text-secondary">
                    <strong>Attendees:</strong> {event.attendees.length}
                  </p>
                </div>
                <p className="text-secondary mb-4">
                  <strong>Registration:</strong> {event.registrationMode}
                </p>
                {event.registrationMode === "Open" && (
                  <Button
                    className="btn-primary w-full"
                    onClick={() => handleRegister(event.id)}
                    disabled={
                      !isAuthenticated ||
                      event.attendees.includes(principal?.toString() || "")
                    }
                  >
                    {event.attendees.includes(principal?.toString() || "")
                      ? "Already Registered"
                      : "Register for Event"}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
