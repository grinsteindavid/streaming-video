using MediatR;

namespace VideoStreamingApi.Application.Commands.Videos
{
    public class DeleteVideoCommand : IRequest<bool>
    {
        public Guid Id { get; set; }
    }
}
