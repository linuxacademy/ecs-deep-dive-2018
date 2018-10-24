FROM ubuntu:18.04

RUN apt-get update
RUN apt-get install -y python-pip python-pil
RUN pip install awscli boto3

ADD GetAndResizeImages.py /

CMD ["/GetAndResizeImages.py"]
