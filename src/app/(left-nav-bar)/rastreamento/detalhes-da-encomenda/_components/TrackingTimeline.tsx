import type { TrackingEvent } from "@/types";
import {
  getStatusLabel,
  parseSswDateTime,
} from "@core/domain/common/utils/formatters/date.formatter";

type TrackingTimelineProps = {
  events: TrackingEvent[];
};

function getEventContent(event: TrackingEvent) {
  const title = event.title?.trim() ?? "";
  const fullDescription = event.description.trim();
  const rawDetail = event.detail?.trim() ?? "";

  if (!title) {
    return {
      title: "",
      detail: rawDetail || fullDescription,
    };
  }

  const detailWithoutRepeatedTitle = rawDetail
    .toUpperCase()
    .startsWith(title.toUpperCase())
    ? rawDetail.slice(title.length).trim()
    : rawDetail;

  if (detailWithoutRepeatedTitle) {
    return {
      title,
      detail: detailWithoutRepeatedTitle,
    };
  }

  const detailFromFullDescription = fullDescription
    .toUpperCase()
    .startsWith(title.toUpperCase())
    ? fullDescription.slice(title.length).trim()
    : fullDescription === title
      ? ""
      : fullDescription;

  return {
    title,
    detail: detailFromFullDescription,
  };
}

export function TrackingTimeline({ events }: TrackingTimelineProps) {
  const sortedEvents = [...events].sort((left, right) => {
    const leftTime = parseSswDateTime(left.dateTime)?.getTime() ?? 0;
    const rightTime = parseSswDateTime(right.dateTime)?.getTime() ?? 0;

    return leftTime - rightTime;
  });

  const groups = sortedEvents.reduce<
    Array<{
      label: string;
      events: TrackingEvent[];
    }>
  >((result, event) => {
    const label = getStatusLabel(event.status);
    const currentGroup = result[result.length - 1];

    if (currentGroup?.label === label) {
      currentGroup.events.push(event);
      return result;
    }

    result.push({ label, events: [event] });
    return result;
  }, []);

  return (
    <div className="relative">
      {groups.map((group, groupIndex) => {
        const isCurrentGroup = groupIndex === groups.length - 1;

        return (
          <section
            key={`${group.label}-${groupIndex}`}
            className="relative pb-8 pl-8 last:pb-0"
          >
            {groupIndex < groups.length - 1 ? (
              <div className="absolute top-3 bottom-0 left-[5.5px] w-px bg-green-500" />
            ) : null}
            <span
              aria-hidden="true"
              className="absolute left-0 top-1.5 flex h-3 w-3 items-center justify-center rounded-full border border-green-500 bg-green-500"
            >
              <span
                className={`rounded-full bg-white ${
                  isCurrentGroup ? "h-1.5 w-1.5" : "h-0.5 w-0.5"
                }`}
              />
            </span>

            <h3
              className={`text-lg font-bold leading-6 ${
                isCurrentGroup ? "text-green-600" : "text-slate-950"
              }`}
            >
              {group.label}
            </h3>

            <div className="mt-2 space-y-6">
              {group.events.map((event, eventIndex) => {
                const content = getEventContent(event);

                return (
                  <article
                    key={`${event.dateTime}-${event.description}-${eventIndex}`}
                    className="space-y-1.5"
                  >
                    <p className="text-sm font-bold leading-5 text-slate-950">
                      <time>{event.dateTime || "Data indisponível"}</time>
                      <span aria-hidden="true"> · </span>
                      <span>
                        {event.location || "Local indisponível"}
                        {event.unit ? ` · ${event.unit}` : ""}
                      </span>
                    </p>
                    {content.title ? (
                      <p className="text-sm font-extrabold uppercase leading-5 text-slate-950">
                        {content.title}
                      </p>
                    ) : null}
                    {content.detail ? (
                      <p className="text-sm font-normal leading-6 text-slate-800">
                        {content.detail}
                      </p>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
